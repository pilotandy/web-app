import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { TemplateModule } from './template/template.module';
import { TemplateService } from './shared/services/template.service';
import { NotifyService } from './shared/services/notify.service';

// Layout Component
import { CommonLayoutComponent } from './common/common-layout.component';
import { AuthenticationLayoutComponent } from './common/authentication-layout.component';

// Routing Module
import { AppRoutes } from './app.routing';

// App Component
import { AppComponent } from './app.component';

// JWT Tokens
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ModalModule } from 'ngx-bootstrap/modal';

// Hammer
import 'hammerjs';
import 'hammer-timejs';
import { AddInvoiceComponent } from './dashboard/cfi/billing/add-invoice/add-invoice.component';
import { AddPaymentComponent } from './dashboard/cfi/billing/add-payment/add-payment.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(AppRoutes, { useHash: false }),
        SharedModule,
        TemplateModule,
        NgbModule,
        ModalModule.forRoot(),
    ],
    declarations: [
        AppComponent,
        CommonLayoutComponent,
        AuthenticationLayoutComponent,
        AddInvoiceComponent,
        AddPaymentComponent,
    ],

    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        JwtHelperService,
        TemplateService,
        NotifyService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
