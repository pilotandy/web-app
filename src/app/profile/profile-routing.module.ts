import { Routes } from '@angular/router';

import { ProfileComponent } from './profile.component';
import { StatementComponent } from './statement.component';

export const ProfileRoutes: Routes = [
    {
        path: '',
        component: ProfileComponent,
        data: {
            title: 'Profile',
        },
    },
    {
        path: ':id',
        component: ProfileComponent,
        data: {
            title: 'Profile',
        },
    },
    {
        path: 'statement',
        component: StatementComponent,
        data: {
            title: 'Statement',
        },
    },
];
