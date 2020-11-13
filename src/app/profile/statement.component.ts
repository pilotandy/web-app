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
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile-statement',
    templateUrl: './statement.component.html',
    styleUrls: ['./statement.css'],
})
export class StatementComponent implements OnInit, OnDestroy {
    @Input() user: User;
    @ViewChild('invoice') invoiceRef: ElementRef;
    private subs: Subscription[] = [];
    list = [];
    invoices: Invoice[] = [];
    payments: Payment[] = [];

    constructor() {}

    ngOnInit(): void {
        this.invoices = this.user.invoices;
        this.payments = this.user.payments;
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
