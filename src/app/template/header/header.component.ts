import { Subscription } from 'rxjs';
import { Notify, NotifyService } from './../../shared/services/notify.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TemplateService } from '../../shared/services/template.service';
import { UserService, User } from 'src/app/user/user.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
    searchModel: string;
    isCollapse: boolean;
    isOpen: boolean;
    searchActived = false;
    user: User;

    notifications: Notify[];

    private subs: Subscription[] = [];

    constructor(
        private tplSvc: TemplateService,
        private userService: UserService,
        private notifyService: NotifyService
    ) {}

    ngOnInit(): void {
        this.subs.push(
            this.userService.currentUser.subscribe((user: User) => {
                this.user = user;
            })
        );
        this.subs.push(
            this.tplSvc.isSideNavCollapseChanges.subscribe(
                (isCollapse) => (this.isCollapse = isCollapse)
            )
        );
        this.subs.push(
            this.tplSvc.isSidePanelOpenChanges.subscribe(
                (isOpen) => (this.isOpen = isOpen)
            )
        );
        this.subs.push(
            this.notifyService.current.subscribe((notifys: Notify[]) => {
                this.notifications = notifys.filter((n) => {
                    return n.viewed === false;
                });
            })
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    toggleSideNavCollapse() {
        this.isCollapse = !this.isCollapse;
        this.tplSvc.toggleSideNavCollapse(this.isCollapse);
    }

    toggleSidePanelOpen() {
        this.isOpen = !this.isOpen;
        this.tplSvc.toggleSidePanelOpen(this.isOpen);
    }

    toggleSearch() {
        this.searchActived = !this.searchActived;
        console.log(this.searchActived);
    }
}
