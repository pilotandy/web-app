import { NotificationListComponent } from './notification/notification-list.component';
import { NotificationDetailComponent } from './notification/notification-detail.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeConstants } from '../shared/config/theme-constant';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DashboardRoutes } from './dashboard-routing.module';

// Dashboard Component
import { DashboardComponent } from './dashboard.component';
import { CFIComponent } from './cfi/cfi.component';
import { PPLComponent } from './ppl/ppl.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LogoutComponent } from './logout/logout.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        RouterModule.forChild(DashboardRoutes),
        PerfectScrollbarModule,
        SharedModule,
    ],
    declarations: [
        DashboardComponent,
        NotificationListComponent,
        NotificationDetailComponent,
        LogoutComponent,
        CFIComponent,
        PPLComponent,
        WelcomeComponent,
    ],
    providers: [ThemeConstants],
})
export class DashboardModule {}
