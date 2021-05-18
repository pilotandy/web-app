import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService, User } from 'src/app/user/user.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'dashboard.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
    user: User;

    private subs: Subscription[] = [];

    constructor(private userService: UserService) {}

    ngOnInit(): void {
        this.subs.push(
            this.userService.currentUser.subscribe((user: User) => {
                this.user = user;
            })
        );
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }
}
