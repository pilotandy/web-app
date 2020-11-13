import { Component, OnInit } from '@angular/core';
import { TemplateService } from '../shared/services/template.service';

export type HeaderType = 'header-default' | 'header-primary' | 'header-info' | 'header-success' | 'header-danger' | 'header-dark';
export type SideNavType = 'sidenav-default' | 'side-nav-dark';

@Component({
    selector: 'app-dashboard',
    templateUrl: './common-layout.component.html'
})

export class CommonLayoutComponent implements OnInit {

    headerThemes = ['header-default', 'header-primary', 'header-info', 'header-success', 'header-danger', 'header-dark'];
    sidenavThemes = ['sidenav-default', 'side-nav-dark'];
    headerSelected: HeaderType;
    sidenavSelected: SideNavType;
    isCollapse: boolean;
    rtlActived = false;

    constructor(private tplSvc: TemplateService) {
    }

    ngOnInit() {
        this.tplSvc.isSideNavCollapseChanges.subscribe(isCollapse => this.isCollapse = isCollapse);
    }
}
