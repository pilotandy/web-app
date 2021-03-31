import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page404Component } from './404/404.component';
import { RouterModule } from '@angular/router';
import { Page403Component } from './403/403.component';

@NgModule({
    imports: [CommonModule, RouterModule],
    declarations: [Page404Component, Page403Component],
    exports: [Page404Component, Page403Component],
})
export class ExtrasModule {}
