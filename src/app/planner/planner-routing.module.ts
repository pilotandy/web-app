import { Routes } from '@angular/router';

import { PlannerComponent } from './planner.component';

export const PlannerRoutes: Routes = [
    {
        path: '',
        component: PlannerComponent,
        data: {
            title: 'Planner',
        },
    },
];
