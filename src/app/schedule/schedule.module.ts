import { EventComponent } from './modals/event/event.component';
import { ScheduleComponent } from './schedule.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeConstants } from '../shared/config/theme-constant';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ScheduleRoutes } from './schedule-routing.module';
import { DayCalendarComponent } from './calendars/day.component';
import { WeekCalendarComponent } from './calendars/week.component';
import { MonthCalendarComponent } from './calendars/month.component';
import { SharedModule } from '../shared/shared.module';
import { DayEventComponent } from './calendars/day-event.component';
import { HammerModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DTRangeComponent } from './modals/event/dtrange.component';
import { EvtCalendarComponent } from './modals/event/calendar.component';

@NgModule({
    imports: [
        RouterModule.forChild(ScheduleRoutes),
        PerfectScrollbarModule,
        SharedModule,
        HammerModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        ScheduleComponent,
        DayCalendarComponent,
        WeekCalendarComponent,
        MonthCalendarComponent,
        DayEventComponent,
        EventComponent,
        DTRangeComponent,
        EvtCalendarComponent,
    ],
    providers: [ThemeConstants],
})
export class ScheduleModule {}
