import { Invoice, Payment, User, UserService } from './../user/user.service';
import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    OnDestroy,
    Input,
} from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
    selector: 'app-profile-statement',
    templateUrl: './statement.component.html',
    styleUrls: ['./statement.css'],
})
export class StatementComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    list = [];
    invoices: Invoice[] = [];
    payments: Payment[] = [];
    start: moment.Moment;
    end: moment.Moment;
    user: User;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.subs.push(
            this.route.queryParams.subscribe((params: Params) => {
                this.start = moment(params.s);
                this.end = moment(params.e);
                // Get the user, switch if necessary
                this.userService.currentUser.subscribe((u) => {
                    if (u.groups.includes('Flight Instructor')) {
                        this.route.params.subscribe((p: Params) => {
                            if (p.id) {
                                const id = Number(p.id);
                                this.userService.allUsers.subscribe((users) => {
                                    const student = users.find((usr) => {
                                        return usr.id === id;
                                    });
                                    if (student) {
                                        this.user = student;
                                    } else {
                                        this.user = u;
                                    }
                                });
                            } else {
                                this.user = u;
                            }
                        });
                    } else {
                        this.user = u;
                    }

                    // Get the invoices / payments

                    this.invoices = [];
                    this.payments = [];
                    this.user.invoices.forEach((inv) => {
                        if (
                            moment(inv.date) >= this.start &&
                            moment(inv.date) <= this.end
                        ) {
                            this.invoices.push(inv);
                        }
                    });
                    this.user.payments.forEach((pmt) => {
                        if (
                            moment(pmt.date) >= this.start &&
                            moment(pmt.date) <= this.end
                        ) {
                            this.payments.push(pmt);
                        }
                    });
                });
            })
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    calcSubTotal(invoice: Invoice) {
        let total = 0;
        invoice.items.forEach((i) => {
            total += i.quantity * i.rate;
        });
        return total;
    }

    calcGrandTotal() {
        let total = 0;
        this.invoices.forEach((inv) => {
            inv.items.forEach((i) => {
                total += i.quantity * i.rate;
            });
        });
        return total;
    }

    calcGrandPayments() {
        let payments = 0;
        this.payments.forEach((p) => {
            payments += p.amount;
        });
        return payments;
    }

    calcBalance() {
        let total = 0;
        this.invoices.forEach((inv) => {
            inv.items.forEach((i) => {
                total += i.quantity * i.rate;
            });
        });

        let payments = 0;
        this.payments.forEach((p) => {
            payments += p.amount;
        });

        return payments - total;
    }
}
