import { Routes } from '@angular/router';

// Dashboard Components
import { DashboardComponent } from './dashboard.component';
import { LogoutComponent } from './logout/logout.component';
import { NotificationListComponent } from './notification/notification-list.component';
import { NotificationDetailComponent } from './notification/notification-detail.component';

export const DashboardRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        data: {
            title: 'Dashboard',
        },
    },
    {
        path: 'notification',
        component: NotificationListComponent,
        data: {
            title: 'Notifications',
        },
    },
    {
        path: 'notification/:id',
        component: NotificationDetailComponent,
        data: {
            title: 'Notifications',
        },
    },
    {
        path: 'logout',
        component: LogoutComponent,
        data: {
            title: 'Logout',
        },
    },
];
