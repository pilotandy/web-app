import { element } from 'protractor';
import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    Output,
    EventEmitter,
    AfterContentInit,
} from '@angular/core';
import { User } from 'src/app/user/user.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentService } from './payment.service';
import { UUID } from 'angular2-uuid';

declare var SqPaymentForm: any;

export interface Account {
    date: moment.Moment;
    title: string;
    amount: number;
}

@Component({
    selector: 'app-payment',
    templateUrl: 'payment.html',
    styleUrls: ['./payment.scss'],
})
export class PaymentComponent implements OnInit, OnDestroy, AfterContentInit {
    @Input() user: User;
    @Input() balance: number;
    @Output() action = new EventEmitter();

    paymentForm: typeof SqPaymentForm;
    loadingForm = false;
    feePercent = 3.5;
    feeFlat = 0.15;
    amount = 0;
    idempotencyKey = '';
    success: string | null;
    error: string | null;
    processing = false;

    selectedTab = 0;

    private subs: Subscription[] = [];

    constructor(private paymentService: PaymentService) {}

    ngOnInit(): void {
        this.idempotencyKey = UUID.UUID();
        this.amount = this.balance;
    }

    ngOnDestroy(): void {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    ngAfterContentInit(): void {
        this.paymentForm = new SqPaymentForm({
            // Initialize the payment form elements
            applicationId: environment.squareUpId,
            card: { elementId: 'sq-card' },
            callbacks: {
                paymentFormLoaded: async () => {
                    this.loadingForm = false;
                },
                cardNonceResponseReceived: async (errors, nonce, cardData) => {
                    if (errors) {
                        // Log errors from nonce generation to the browser developer console.
                        console.error('Encountered errors:');
                        errors.forEach(function (error) {
                            console.error('  ' + error.message);
                        });
                        // alert(
                        //     'Encountered errors, check browser developer console for more details'
                        // );
                        return;
                    }

                    // Submit the payment
                    this.error = null;
                    this.processing = true;
                    this.paymentService
                        .submitPayment(
                            this.amount,
                            this.calcTotal(),
                            nonce,
                            this.idempotencyKey
                        )
                        .then((result) => {
                            this.success = result;
                            setTimeout(() => {
                                this.onComplete();
                            }, 1000);
                        })
                        .catch((error) => {
                            this.error = error;
                        })
                        .finally(() => {
                            this.processing = false;
                        });
                },
            },
        });
        this.loadingForm = true;
        this.paymentForm.build();
    }

    onSelectTab(tab: number) {
        this.selectedTab = tab;
    }

    calcTotal(): number {
        if (this.amount <= 0) return 0;
        const fee = this.feePercent / 100.0 + 1.0;
        const total = this.amount * fee + this.feeFlat + 0.0001;
        return Number(total.toFixed(2));
    }

    isValidPayment(): boolean {
        return this.calcTotal() > 0;
    }

    onSubmitPayment(event: MouseEvent): void {
        event.preventDefault();
        this.paymentForm.requestCardNonce();
    }

    onComplete(): void {
        this.action.next(true);
        this.action.complete();
    }

    onCancel(): void {
        this.action.next(false);
        this.action.complete();
    }
}
