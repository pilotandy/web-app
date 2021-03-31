import { Routes } from '@angular/router';
import { PPLLessonsComponent } from './ppl/ppl-lessons.component';

import { SchoolComponent } from './school.component';

export const SchoolRoutes: Routes = [
    {
        path: '',
        component: SchoolComponent,
        data: {
            title: 'School',
        },
    },
    {
        path: 'private',
        component: PPLLessonsComponent,
        data: {
            title: 'School - Private Pilot',
        },
    },
];
