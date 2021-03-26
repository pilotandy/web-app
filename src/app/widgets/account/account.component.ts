import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService, User } from 'src/app/user/user.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

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
    expanded = false;

    accounts: Account[] = [];
    balance: number;

    private subs: Subscription[] = [];

    constructor(private userService: UserService) {}

    ngOnInit(): void {
        this.subs.push(
            this.userService.currentUser.subscribe((u) => {
                this.balance = 0;
                this.accounts = [];
                u.invoices.forEach((invc) => {
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

                u.payments.forEach((p) => {
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
            })
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    getMax() {
        if (!this.expanded && this.max) {
            return this.max;
        }
        return this.accounts.length;
    }
}
