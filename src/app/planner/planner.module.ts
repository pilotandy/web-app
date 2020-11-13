import { PlannerComponent } from './planner.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeConstants } from '../shared/config/theme-constant';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { PlannerRoutes } from './planner-routing.module';

@NgModule({
    imports: [RouterModule.forChild(PlannerRoutes), PerfectScrollbarModule],
    declarations: [PlannerComponent],
    providers: [ThemeConstants],
})
export class PlannerModule {}
