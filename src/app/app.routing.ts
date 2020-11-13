import { Routes } from '@angular/router';

// Layouts
import { CommonLayoutComponent } from './common/common-layout.component';
import { AuthenticationLayoutComponent } from './common/authentication-layout.component';
import { AuthGuard } from './auth/auth.guard';

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
            // {
            //     path: '500',
            //     component: Page500Component,
            //     data: {
            //         title: '500',
            //     },
            // },
            // {
            //     path: '404',
            //     component: Page404Component,
            //     data: {
            //         title: '404',
            //     },
            // },
        ],
    },
];
