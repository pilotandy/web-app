import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, EmailCredentials } from '../auth.service';
import { UserService, User } from 'src/app/user/user.service';

@Component({
    templateUrl: 'sign-up.html',
})
export class SignUpComponent {
    error: string;

    registerForm = new FormGroup(
        {
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required]),
            confirmPassword: new FormControl('', [Validators.required]),
            firstname: new FormControl('', [Validators.required]),
            lastname: new FormControl('', [Validators.required]),
        },
        this.validatePasswords
    );
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    getErrorList(errorObject) {
        return Object.keys(errorObject);
    }

    validatePasswords(group: FormGroup) {
        const pass = group.controls.password.value;
        const confirmPassword = group.controls.confirmPassword.value;
        return pass === confirmPassword ? null : { valid: false };
    }

    onRegister() {
        this.error = '';
        this.authService.register(this.registerForm.value).subscribe(
            (results) => {
                const creds: EmailCredentials = {
                    email: this.registerForm.value.email,
                    password: this.registerForm.value.password,
                };
                this.authService.login(creds).subscribe(
                    (res) => {
                        this.userService.currentUser.subscribe((user: User) => {
                            if (user.id > 0) {
                                this.router.navigateByUrl('/dashboard');
                            }
                        });
                    },
                    (error) => {
                        this.error = error.error;
                    }
                );
            },
            (errors) => {
                this.error = 'Email address already in use.';
            }
        );
    }
}
