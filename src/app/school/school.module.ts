import { SchoolComponent } from './school.component';
import { PPLLessonsComponent } from './ppl/ppl-lessons.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeConstants } from '../shared/config/theme-constant';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { SchoolRoutes } from './school-routing.module';

@NgModule({
    imports: [RouterModule.forChild(SchoolRoutes), PerfectScrollbarModule],
    declarations: [SchoolComponent, PPLLessonsComponent],
    providers: [ThemeConstants],
})
export class SchoolModule {}
