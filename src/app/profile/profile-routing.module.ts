import { PreSoloComponent } from './../widgets/presolo/presolo.component';
import { Routes } from '@angular/router';
import { AdminGuard, AuthGuard } from '../auth/auth.guard';
import { Page404Component } from '../extras/404/404.component';
import { AccountComponent } from '../widgets/account/account.component';

import { ProfileComponent } from './profile.component';
import { StatementComponent } from './statement.component';

export const ProfileRoutes: Routes = [
    {
        path: '',
        component: ProfileComponent,
    },
    {
        path: 'account',
        canActivate: [AuthGuard],
        component: AccountComponent,
    },
    {
        path: 'statement',
        canActivate: [AuthGuard],
        component: StatementComponent,
    },
    {
        path: ':id/account',
        canActivate: [AdminGuard],
        component: AccountComponent,
    },
    {
        path: ':id/presolo',
        canActivate: [AdminGuard],
        component: PreSoloComponent,
    },
    {
        path: ':id',
        canActivate: [AdminGuard],
        component: ProfileComponent,
    },
    {
        path: '**',
        component: Page404Component,
    },
];
