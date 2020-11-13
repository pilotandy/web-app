import { BsModalRef } from 'ngx-bootstrap/modal';
import {
    Component,
    OnInit,
    EventEmitter,
    Output,
    OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Invoice, User, UserService } from 'src/app/user/user.service';
import { Aircraft, AircraftService } from 'src/app/aircraft/aircraft.service';
import * as moment from 'moment';
import { WaitState } from 'src/app/shared/components/waiting.component';

@Component({
    selector: 'app-add-invoice',
    templateUrl: './add-invoice.component.html',
    styleUrls: [],
})
export class AddInvoiceComponent implements OnInit, OnDestroy {
    @Output() action = new EventEmitter();

    private subs: Subscription[] = [];

    users: User[];
    aircrafts: Aircraft[];
    cfis: User[];
    discounts = [
        { name: 'Mechanic Special', code: 'mech' },
        { name: 'Instructor', code: 'inst' },
        { name: 'Discovery Flight', code: 'disc' },
    ];

    selected = {
        pilot: null,
        aircraft: null,
        cfi: null,
        date: moment().format('YYYY-MM-DD'),
        discount: null,
    };

    flight = {
        qty: null,
        dual: false,
    };

    ground = {
        name: 'Ground Instruction',
        qty: null,
    };

    other = {
        name: null,
        cost: null,
        qty: null,
    };

    invoice: Invoice;

    stateSave: WaitState;

    constructor(
        private userService: UserService,
        private aircraftService: AircraftService,
        private modalRef: BsModalRef
    ) {}

    ngOnInit() {
        this.subs.push(
            this.userService.currentUser.subscribe((user: User) => {})
        );
        this.subs.push(
            this.userService.allUsers.subscribe((users: User[]) => {
                this.cfis = [];
                this.users = users;
                users.forEach((u) => {
                    if (u.groups.includes('Flight Instructor')) {
                        this.cfis.push(u);
                    }
                });
            })
        );
        this.subs.push(
            this.aircraftService.allAircraft.subscribe(
                (aircrafts: Aircraft[]) => {
                    this.aircrafts = aircrafts;
                    this.selected.aircraft = aircrafts.find((a) => {
                        return a.name === 'N8081P';
                    });
                }
            )
        );

        this.invoice = {
            date: new Date(),
            description: null,
            items: [],
        };

        this.stateSave = WaitState.idle;
    }

    ngOnDestroy(): void {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    onSaveInvoice() {
        this.stateSave = WaitState.wait;
        const user: User = JSON.parse(JSON.stringify(this.selected.pilot));
        user.invoices.push(this.invoice);
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

    onCancel() {
        this.action.next(false);
        this.action.complete();
    }

    totalInvoice() {
        let total = 0;
        this.invoice.items.forEach((item) => {
            total += item.rate * item.quantity;
        });
        return total;
    }

    totalInstructorCost() {
        let total = 0;
        this.invoice.items.forEach((item) => {
            if (item.name.includes('Instruction')) {
                total += item.rate * item.quantity;
            }
        });
        return total;
    }

    onRemoveItem(index: number) {
        this.invoice.items.splice(index, 1);
    }

    onToggleDual() {
        this.flight.dual = !this.flight.dual;
    }

    validFlight() {
        if (this.flight.qty > 0 && this.selected.aircraft) {
            if (this.flight.dual) {
                if (this.selected.cfi) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        }
        return false;
    }

    validGround() {
        if (this.selected.cfi) {
            return true;
        }
        return false;
    }

    validOther() {
        if (this.other.cost > 0 && this.other.name && this.other.qty > 0) {
            return true;
        }
        return false;
    }

    validInvoice() {
        if (this.selected.pilot && this.invoice.description) {
            if (this.invoice.items.length > 0) {
                return true;
            }
        }
        return false;
    }

    onAddFlight() {
        this.invoice.items.push({
            name: 'Aircraft: ' + this.selected.aircraft.name,
            rate: this.selected.aircraft.model.rate,
            quantity: this.flight.qty,
        });
        if (this.flight.dual) {
            this.invoice.items.push({
                name:
                    'Flight Instruction: ' +
                    this.selected.cfi.firstname +
                    ' ' +
                    this.selected.cfi.lastname,
                rate: this.selected.cfi.data.rate,
                quantity: this.flight.qty,
            });
        }
        this.flight.qty = null;
        this.flight.dual = false;
    }

    onAddGround() {
        this.invoice.items.push({
            name:
                'Ground Instruction: ' +
                this.selected.cfi.firstname +
                ' ' +
                this.selected.cfi.lastname,
            rate: this.selected.cfi.data.rate,
            quantity: this.ground.qty,
        });
        this.ground.qty = null;
    }

    onAddOther() {
        this.invoice.items.push({
            name: this.other.name,
            rate: this.other.cost,
            quantity: this.other.qty,
        });
        this.other.name = null;
        this.other.cost = null;
        this.other.qty = null;
    }

    onAddDiscount() {
        // Remove any others...
        this.invoice.items = this.invoice.items.filter((i) => {
            if (!i.name.includes('Discount:')) {
                return i;
            }
        });

        // Apply new discount
        if (this.selected.discount) {
            const name = this.selected.discount.name;
            const code = this.selected.discount.code;

            let amt = 0;
            if (code === 'mech') {
                amt = this.totalInvoice();
            }

            if (code === 'inst') {
                amt = this.totalInstructorCost();
            }

            if (code === 'disc') {
                const tot = this.totalInvoice();
                amt = tot - 50;
            }

            this.invoice.items.push({
                name: 'Discount: ' + name,
                rate: amt * -1,
                quantity: 1,
            });
        }
    }
}
