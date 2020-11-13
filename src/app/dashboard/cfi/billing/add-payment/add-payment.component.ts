import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { WaitState } from 'src/app/shared/components/waiting.component';
import { Payment, User, UserService } from 'src/app/user/user.service';

@Component({
    selector: 'app-add-payment',
    templateUrl: './add-payment.component.html',
    styleUrls: [],
})
export class AddPaymentComponent implements OnInit {
    @Output() action = new EventEmitter();

    private subs: Subscription[] = [];
    users: User[];
    pilot: User;
    payment: Payment;
    stateSave: WaitState;

    constructor(private userService: UserService) {}

    ngOnInit() {
        this.subs.push(
            this.userService.allUsers.subscribe((users: User[]) => {
                this.users = users;
            })
        );
        this.payment = {
            date: new Date(),
            amount: 0,
        };
        this.pilot = null;
        this.stateSave = WaitState.idle;
    }

    validPayment() {
        if (this.payment.amount > 0) {
            return true;
        }
        return false;
    }

    onCancel() {
        this.action.next(false);
        this.action.complete();
    }

    onSavePayment() {
        this.stateSave = WaitState.wait;
        const user: User = JSON.parse(JSON.stringify(this.pilot));
        user.payments.push(this.payment);
        this.userService.saveUser(user).subscribe(
            (u) => {
                this.stateSave = WaitState.success;
                setTimeout(() => {
                    this.stateSave = WaitState.idle;
                    this.action.next(true);
                    this.action.complete();
                }, 250);
            },
            (err) => {
                this.stateSave = WaitState.error;
            }
        );
    }
}
