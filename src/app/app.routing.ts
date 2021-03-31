import { Routes } from '@angular/router';

// Layouts
import { CommonLayoutComponent } from './common/common-layout.component';
import { AuthenticationLayoutComponent } from './common/authentication-layout.component';
import { AuthGuard } from './auth/auth.guard';
import { IntroComponent } from './common/intro.component';
import { Page404Component } from './extras/404/404.component';
import { Page403Component } from './extras/403/403.component';

export const AppRoutes: Routes = [
    {
        path: '',
        component: CommonLayoutComponent,
        children: [
            {
                path: 'dashboard',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
            },
            {
                path: 'profile',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./profile/profile.module').then(
                        (m) => m.ProfileModule
                    ),
            },
            {
                path: 'aircraft',
                loadChildren: () =>
                    import('./aircraft/aircraft.module').then(
                        (m) => m.AircraftModule
                    ),
            },
            {
                path: 'schedule',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./schedule/schedule.module').then(
                        (m) => m.ScheduleModule
                    ),
            },
            {
                path: 'school',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./school/school.module').then(
                        (m) => m.SchoolModule
                    ),
            },
            {
                path: 'planner',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./planner/planner.module').then(
                        (m) => m.PlannerModule
                    ),
            },
            {
                path: '',
                component: IntroComponent,
            },
        ],
    },
    {
        path: '',
        component: AuthenticationLayoutComponent,
        children: [
            {
                path: 'auth',
                loadChildren: () =>
                    import('./auth/authentication.modules').then(
                        (m) => m.AuthenticationModule
                    ),
            },
        ],
    },
    {
        path: 'auth/403',
        component: Page403Component,
    },
    {
        path: '**',
        component: Page404Component,
    },
];
