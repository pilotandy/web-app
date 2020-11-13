import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, User } from 'src/app/user/user.service';

@Component({
    templateUrl: 'sign-in.html',
})
export class SignInComponent implements OnInit {
    error: string;

    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
    });

    returnUrl: string;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.error = null;
        const key = 'returnUrl';
        this.returnUrl = this.route.snapshot.queryParams[key] || 'dashboard';
    }

    onLogin() {
        this.error = null;
        this.authService.login(this.loginForm.value).subscribe(
            (results) => {
                this.userService.currentUser.subscribe((user: User) => {
                    if (user) {
                        const url = this.router.parseUrl(
                            decodeURI(this.returnUrl)
                        );
                        this.router.navigateByUrl(url);
                    }
                });
            },
            (error) => {
                if (error === 'Refresh token not set.') {
                    error = 'Could not login. Check username and password.';
                }
                this.error = error;
            }
        );
    }
}
