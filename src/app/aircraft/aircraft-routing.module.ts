import { Routes } from '@angular/router';

import { AircraftComponent } from './aircraft.component';

export const AircraftRoutes: Routes = [
    {
        path: '',
        component: AircraftComponent,
        data: {
            title: 'Aircraft',
        },
    },
];
