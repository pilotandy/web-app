import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, NEVER } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService, JWTAccessToken } from './auth/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<
        any
    >(null);

    constructor(private authService: AuthService) {}

    getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            cookies.forEach((cookie) => {
                cookie = cookie.trim();
                if (cookie.substring(0, name.length + 1) === name + '=') {
                    cookieValue = decodeURIComponent(
                        cookie.substring(name.length + 1)
                    );
                }
            });
        }
        return cookieValue;
    }

    addToken(req: HttpRequest<any>, token: JWTAccessToken): HttpRequest<any> {
        if (token.access) {
            return req.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + token.access,
                },
            });
        } else {
            return req;
        }
    }

    isRefreshError(url: string) {
        if (this.isRefreshing && url.endsWith('/jwt/token/refresh/')) {
            return true;
        }
        return false;
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        let request = req.clone({
            url: environment.url + req.url,
        });
        request = this.addToken(request, this.authService.getAccessToken());
        return next.handle(request).pipe(
            catchError((error) => {
                if (
                    error instanceof HttpErrorResponse &&
                    error.status === 401
                ) {
                    return this.handle401Error(request, next);
                } else {
                    return throwError(error);
                }
            })
        );
    }

    handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            if (this.authService.getRefreshToken() !== null) {
                this.isRefreshing = true;
                this.refreshTokenSubject.next(null);
                return this.authService.refreshToken().pipe(
                    switchMap((token: JWTAccessToken) => {
                        this.isRefreshing = false;
                        this.refreshTokenSubject.next(token);
                        return next.handle(this.addToken(request, token));
                    })
                );
            }
            // We don't have a refresh token, so don't bother...
            return throwError({
                status: 400,
                statusText: 'Refresh token not set.',
            });
        } else {
            if (this.isRefreshError(request.url)) {
                this.isRefreshing = false;
                this.authService.logout();
                return NEVER;
            }
            return this.refreshTokenSubject.pipe(
                filter((token: JWTAccessToken) => token != null),
                take(1),
                switchMap((token) => {
                    return next.handle(this.addToken(request, token));
                })
            );
        }
    }
}
