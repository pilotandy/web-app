import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService, User } from 'src/app/user/user.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';

export interface Account {
    date: moment.Moment;
    title: string;
    amount: number;
}

@Component({
    selector: 'app-account',
    templateUrl: 'account.html',
    styleUrls: ['./account.scss'],
})
export class AccountComponent implements OnInit, OnDestroy {
    @Input() max: number;
    @Input() all = false;
    @Input() user: User | null;
    expanded = false;

    accounts: Account[] = [];
    balance: number;

    private subs: Subscription[] = [];

    constructor(
        private userService: UserService,
        private location: Location,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        if (this.user) {
            this.loadUser(this.user);
        } else {
            this.subs.push(
                this.userService.currentUser.subscribe((u) => {
                    if (u.groups.includes('Flight Instructor')) {
                        this.route.params.subscribe((params: Params) => {
                            if (params.id) {
                                const id = Number(params.id);
                                // push all users, get by id
                                this.userService.allUsers.subscribe((users) => {
                                    const user = users.find((usr) => {
                                        return usr.id === id;
                                    });
                                    if (user) {
                                        this.loadUser(user);
                                    }
                                });
                            } else {
                                this.loadUser(u);
                            }
                        });
                    } else {
                        console.log(u);
                        this.loadUser(u);
                    }
                })
            );
        }
    }

    ngOnDestroy(): void {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    loadUser(user: User): void {
        this.user = user;
        this.balance = 0;
        this.accounts = [];
        user.invoices.forEach((invc) => {
            let amt = 0;
            invc.items.forEach((i) => {
                amt += i.quantity * i.rate;
            });
            const account = {
                date: moment(invc.date),
                title: invc.description,
                amount: amt,
            };
            this.accounts.push(account);
            this.balance += amt;
        });

        user.payments.forEach((p) => {
            const account = {
                date: moment(p.date),
                title: 'Payment',
                amount: p.amount,
            };
            this.accounts.push(account);
            this.balance -= p.amount;
        });

        // Sort them all
        this.accounts = this.accounts.sort((a: Account, b: Account) => {
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
        return this.accounts.length;
    }
}