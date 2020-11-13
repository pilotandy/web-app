import { map } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScheduleService, CalendarEvent } from '../schedule/schedule.service';
import { UserService, User, Invoice } from 'src/app/user/user.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'dashboard.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
    user: User;
    events: CalendarEvent[];
    activities: any[];
    accounts: any[];
    balance: number;

    private subs: Subscription[] = [];

    constructor(
        private scheduleService: ScheduleService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.events = [];
        this.subs.push(
            this.userService.currentUser.subscribe((user: User) => {
                this.user = user;
                const start = moment(moment().format('YYYY-MM-DDTHH:mm:ssZ'));
                const end = moment(start).add(1, 'months');
                this.scheduleService.getEvents(start, end).then(
                    (events: CalendarEvent[]) => {
                        const now = moment();
                        this.events = [];
                        events
                            .sort((a: CalendarEvent, b: CalendarEvent) => {
                                if (moment(a.start) < moment(b.start)) {
                                    return -1;
                                } else if (moment(a.start) > moment(b.start)) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            })
                            .forEach((e) => {
                                const s = moment(e.start);
                                if (
                                    this.user.id === e.owner ||
                                    (e.resourceIds.find(
                                        (id) => this.user.id === id
                                    ) &&
                                        s > now)
                                ) {
                                    if (this.events.length < 10) {
                                        this.events.push(e);
                                    }
                                }
                            });
                    },
                    (error) => {}
                );
                if (user) {
                    this.activities = [];
                    this.accounts = [];
                    if (user.groups.includes('Flight Instructor')) {
                        this.doTheBigMath();
                    } else {
                        this.doTheMath();
                    }
                }
            })
        );
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    doTheMath() {
        this.balance = 0;
        this.user.invoices
            .sort((a: Invoice, b: Invoice) => {
                if (moment(a.date) > moment(b.date)) {
                    return -1;
                } else if (moment(a.date) < moment(b.date)) {
                    return 1;
                } else {
                    return 0;
                }
            })
            .slice(0, 4) // Limit to 4
            .forEach((invc) => {
                let amt = 0;
                invc.items.forEach((i) => {
                    let sub = '';
                    if (i.name.includes('Aircraft')) {
                        sub =
                            'Flight: ' +
                            Number(i.quantity).toFixed(1).toString();
                    }
                    if (i.name.includes('Ground')) {
                        sub =
                            'Ground: ' +
                            Number(i.quantity).toFixed(1).toString();
                    }
                    if (sub !== '') {
                        const activity = {
                            date: moment(invc.date),
                            title: invc.description,
                            subtitle: sub,
                        };
                        this.activities.push(activity);
                    }

                    amt += i.quantity * i.rate;
                });

                // Accounts
                const account = {
                    date: moment(invc.date),
                    title: invc.description,
                    amount: amt,
                };
                this.accounts.push(account);
                this.balance += amt;
            });

        this.user.payments.forEach((p) => {
            const account = {
                date: moment(p.date),
                title: 'Payment',
                amount: p.amount,
            };
            this.accounts.push(account);
            this.balance -= p.amount;
        });

        this.accounts = this.accounts
            .sort((a: Invoice, b: Invoice) => {
                if (moment(a.date) > moment(b.date)) {
                    return -1;
                } else if (moment(a.date) < moment(b.date)) {
                    return 1;
                } else {
                    return 0;
                }
            })
            .slice(0, 5);
    }

    doTheBigMath() {
        this.balance = 0;
        this.subs.push(
            this.userService.allUsers.subscribe((users: User[]) => {
                if (users) {
                    users.forEach((user: User) => {
                        if (user !== this.user) {
                            user.invoices
                                .slice(0, 4) // Limit to 4
                                .forEach((invc) => {
                                    invc.items.forEach((i) => {
                                        let sub = '';
                                        if (
                                            i.name.includes(
                                                'Flight Instruction'
                                            )
                                        ) {
                                            sub =
                                                'Flight: ' +
                                                Number(i.quantity)
                                                    .toFixed(1)
                                                    .toString();
                                        }
                                        if (sub !== '') {
                                            const activity = {
                                                date: moment(invc.date),
                                                title: invc.description,
                                                subtitle: sub,
                                            };
                                            this.activities.push(activity);
                                        }
                                    });
                                });
                        }
                    });

                    // do the the user...
                    this.doTheMath();

                    this.activities = this.activities
                        .sort((a, b) => {
                            if (moment(a.date) > moment(b.date)) {
                                return -1;
                            } else if (moment(a.date) < moment(b.date)) {
                                return 1;
                            } else {
                                return 0;
                            }
                        })
                        .slice(0, 5);
                }
            })
        );
    }
}
