import { NgxPrintModule } from 'ngx-print';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeConstants } from '../shared/config/theme-constant';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { ProfileRoutes } from './profile-routing.module';
import { StatementComponent } from './statement.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        RouterModule.forChild(ProfileRoutes),
        PerfectScrollbarModule,
        CommonModule,
        SharedModule,
        NgxPrintModule,
    ],
    declarations: [ProfileComponent, StatementComponent],
    providers: [ThemeConstants],
})
export class ProfileModule {}
