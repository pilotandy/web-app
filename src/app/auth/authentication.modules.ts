import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthenticationRoutes } from './authentication.routing';

// Authentication Component
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        RouterModule.forChild(AuthenticationRoutes),
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
    ],
    declarations: [SignInComponent, SignUpComponent],
})
export class AuthenticationModule {}
