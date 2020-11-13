import { Routes } from '@angular/router';

import { SchoolComponent } from './school.component';

export const SchoolRoutes: Routes = [
    {
        path: '',
        component: SchoolComponent,
        data: {
            title: 'School',
        },
    },
];
