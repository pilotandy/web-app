import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService, User } from 'src/app/user/user.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-student',
    templateUrl: 'student.html',
    styleUrls: ['./student.scss'],
})
export class StudentComponent implements OnInit, OnDestroy {
    @Input() detail = false;
    students: User[] = [];

    private subs: Subscription[] = [];

    constructor(private userService: UserService) {}

    ngOnInit(): void {
        this.subs.push(
            this.userService.currentUser.subscribe((curUser) => {
                this.allStudents(curUser);
            })
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    allStudents(curUser) {
        this.subs.push(
            this.userService.allUsers.subscribe((users: User[]) => {
                if (users) {
                    this.students = users.sort((a, b) => {
                        const an = a.firstname + ' ' + a.lastname;
                        const bn = b.firstname + ' ' + b.lastname;
                        if (an < bn) {
                            return -1;
                        } else if (an > bn) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                }
            })
        );
    }

    calcBalance(user: User) {
        let balance = 0;
        if (user) {
            user.invoices.forEach((invc) => {
                let amt = 0;
                invc.items.forEach((i) => {
                    amt += i.quantity * i.rate;
                });
                balance += amt;
            });

            user.payments.forEach((p) => {
                balance -= p.amount;
            });
        }
        return balance;
    }
}
