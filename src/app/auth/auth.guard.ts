import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
} from '@angular/router';

import { UserService } from '../user/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';

const helper = new JwtHelperService();

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private userService: UserService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.userService.currentUser.pipe(
            map((user) => {
                if (user) {
                    if (user.id > 0) {
                        return true;
                    } else {
                        return this.router.createUrlTree(['/auth/sign-in/'], {
                            queryParams: { returnUrl: state.url },
                        });
                    }
                } else {
                    // Just try it again?
                    return this.router.createUrlTree([state.url]);
                }
            })
        );
    }
}

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
    constructor(private userService: UserService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.userService.currentUser.pipe(
            map((user) => {
                if (user) {
                    if (user && user.groups.includes('Flight Instructor')) {
                        return true;
                    } else {
                        return this.router.createUrlTree(['/auth/403/'], {
                            queryParams: { returnUrl: state.url },
                        });
                    }
                } else {
                    // Just try it again?
                    return this.router.createUrlTree([state.url]);
                }
            })
        );
    }
}

@Injectable({ providedIn: 'root' })
export class PreSoloGuard implements CanActivate {
    constructor(private userService: UserService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.userService.currentUser.pipe(
            map((user) => {
                if (user) {
                    if (
                        user &&
                        user.data.presolo &&
                        user.data.presolo === true
                    ) {
                        return true;
                    } else {
                        return this.router.createUrlTree(['/auth/403/'], {
                            queryParams: { returnUrl: state.url },
                        });
                    }
                } else {
                    // Just try it again?
                    return this.router.createUrlTree([state.url]);
                }
            })
        );
    }
}
