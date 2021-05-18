import { PreSoloComponent } from './presolo/presolo.component';
import { NgModule } from '@angular/core';
import { ThemeConstants } from '../shared/config/theme-constant';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from '../shared/shared.module';
import { ActivityComponent } from './activity/activity.component';
import { CommonModule } from '@angular/common';
import { UpcomingComponent } from './upcoming/upcoming.component';
import { AccountComponent } from './account/account.component';
import { RouterModule } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { PaymentComponent } from './payment/payment.component';

@NgModule({
    imports: [CommonModule, RouterModule, PerfectScrollbarModule, SharedModule],
    declarations: [
        ActivityComponent,
        UpcomingComponent,
        AccountComponent,
        PaymentComponent,
        StudentComponent,
        PreSoloComponent,
    ],
    providers: [ThemeConstants],
    exports: [
        ActivityComponent,
        UpcomingComponent,
        AccountComponent,
        StudentComponent,
        PreSoloComponent,
    ],
})
export class WidgetModule {}
