import { AircraftComponent } from './aircraft.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeConstants } from '../shared/config/theme-constant';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AircraftRoutes } from './aircraft-routing.module';

@NgModule({
    imports: [RouterModule.forChild(AircraftRoutes), PerfectScrollbarModule],
    declarations: [AircraftComponent],
    providers: [ThemeConstants],
})
export class AircraftModule {}
