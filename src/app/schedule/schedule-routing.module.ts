import { Routes } from '@angular/router';

import { ScheduleComponent } from './schedule.component';

export const ScheduleRoutes: Routes = [
    {
        path: '',
        component: ScheduleComponent,
        data: {
            title: 'Aircraft',
        },
    },
];
