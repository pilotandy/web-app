import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

export interface EmailCredentials {
    email: string;
    password: string;
}

export interface Registration {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    is_admin: boolean;
    groups: string[];
    data: any;
    invoices: [];
    payments: [];
}

export interface JWTTokenPair {
    access: string;
    refresh: string;
}

export interface JWTAccessToken {
    access: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private userIdSubject: BehaviorSubject<number>;
    public userId: Observable<number>;

    constructor(private http: HttpClient, private router: Router) {
        this.userIdSubject = new BehaviorSubject(null);
        this.userId = this.userIdSubject.asObservable();
        this.setUser();
    }

    login(credentials: EmailCredentials) {
        return new Observable((observer) => {
            this.http.post('/jwt/token/', credentials).subscribe(
                (token: JWTTokenPair) => {
                    localStorage.setItem('access', token.access);
                    localStorage.setItem('refresh', token.refresh);
                    this.setUser();
                    observer.next('login successful.');
                    observer.complete();
                },
                (error) => {
                    if (error.status === 0) {
                        observer.error('Could not reach server.');
                    }
                    observer.error(error.statusText);
                }
            );
        });
    }

    logout() {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        this.setUser();
        this.router.navigateByUrl('/auth/sign-in');
    }

    register(registration: Registration) {
        const key = 'confirmPassword';
        delete registration[key];
        registration.is_admin = false;
        registration.data = {};
        registration.groups = [];
        registration.invoices = [];
        registration.payments = [];
        return this.http.post('/api/users/', registration);
    }

    refreshToken(): Observable<{}> {
        const req = { refresh: localStorage.getItem('refresh') };
        return this.http.post('/jwt/token/refresh/', req).pipe(
            map((token: JWTAccessToken) => {
                if (token) {
                    localStorage.setItem('access', token.access);
                    return token;
                }
                return throwError('failed to get token');
            })
        );
    }

    getAccessToken() {
        return { access: localStorage.getItem('access') } as JWTAccessToken;
    }

    getRefreshToken() {
        return localStorage.getItem('refresh');
    }

    setUser() {
        const access = localStorage.getItem('access');
        if (access) {
            const id = helper.decodeToken(access).user_id;
            this.userIdSubject.next(id);
        } else {
            this.userIdSubject.next(null);
        }
    }
}
