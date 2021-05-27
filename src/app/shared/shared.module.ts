import { SafeHtmlPipe } from './pipes/safehtml.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MomentPipe } from './pipes/moment.pipe';
import { NgxPrintModule } from 'ngx-print';
import { SafeUrlPipe } from './pipes/safeurl.pipe';
import { WaitingComponent } from './components/waiting.component';
import { DatePickerComponent } from './components/datepicker/datepicker.component';

@NgModule({
    exports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        PerfectScrollbarModule,
        NgbModule,
        MomentPipe,
        SafeHtmlPipe,
        SafeUrlPipe,
        WaitingComponent,
        DatePickerComponent,
    ],
    imports: [
        RouterModule,
        CommonModule,
        PerfectScrollbarModule,
        NgbModule,
        NgxPrintModule,
    ],
    declarations: [
        MomentPipe,
        SafeHtmlPipe,
        SafeUrlPipe,
        WaitingComponent,
        DatePickerComponent,
    ],
    providers: [],
})
export class SharedModule {}
