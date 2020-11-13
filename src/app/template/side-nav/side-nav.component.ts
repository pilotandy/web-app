import { Component, OnInit } from '@angular/core';
import { TemplateService } from '../../shared/services/template.service';
import { Router, Event, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-side-nav',
    templateUrl: './side-nav.component.html',
})
export class SideNavComponent implements OnInit {
    isCollapse: boolean;

    constructor(private tplSvc: TemplateService, private router: Router) {
        router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                if (window.innerWidth < 992) {
                    this.tplSvc.toggleSideNavCollapse(false);
                }
            }
        });
    }

    ngOnInit() {
        this.tplSvc.isSideNavCollapseChanges.subscribe(
            (isCollapse) => (this.isCollapse = isCollapse)
        );
    }

    toggleSideNavCollapse() {
        this.isCollapse = !this.isCollapse;
        this.tplSvc.toggleSideNavCollapse(this.isCollapse);
    }
}
