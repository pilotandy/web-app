import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService, User } from 'src/app/user/user.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
    selector: 'app-activity',
    templateUrl: 'activity.html',
    styleUrls: ['./activity.scss'],
})
export class ActivityComponent implements OnInit, OnDestroy {
    @Input() max: number;
    expanded = false;

    user: User;
    activities: any[] = [];

    private subs: Subscription[] = [];

    constructor(private userService: UserService, private location: Location) {}

    ngOnInit(): void {
        this.subs.push(
            this.userService.currentUser.subscribe((u) => {
                this.user = u;
                if (u) {
                    this.activities = [];
                    if (u.groups.includes('Flight Instructor')) {
                        this.allUsers();
                    } else {
                        this.singleUser(u);
                    }
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    allUsers(): void {
        this.subs.push(
            this.userService.allUsers.subscribe((users: User[]) => {
                if (users) {
                    users.forEach((user: User) => {
                        if (user && user !== this.user) {
                            this.singleUser(user);
                        }
                    });
                }
            })
        );
    }

    singleUser(user) {
        user.invoices.forEach((invc) => {
            invc.items.forEach((i) => {
                let sub = '';
                if (i.name.includes('Flight Instruction')) {
                    sub = 'Flight: ' + Number(i.quantity).toFixed(1).toString();
                }
                if (sub !== '') {
                    const activity = {
                        date: moment(invc.date),
                        title:
                            user.firstname +
                            ' ' +
                            user.lastname +
                            ': ' +
                            invc.description,
                        subtitle: sub,
                    };
                    this.activities.push(activity);
                }
            });
        });

        // Sort the activities
        this.activities = this.activities.sort((a, b) => {
            if (moment(a.date) > moment(b.date)) {
                return -1;
            } else if (moment(a.date) < moment(b.date)) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    goBack() {
        this.location.back();
    }

    getMax() {
        if (!this.expanded && this.max) {
            return this.max;
        }
        return this.activities.length;
    }
}
