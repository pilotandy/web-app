import { AddInvoiceComponent } from './billing/add-invoice/add-invoice.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/user/user.service';
import { Subscription } from 'rxjs';
import { AddPaymentComponent } from './billing/add-payment/add-payment.component';

@Component({
    selector: 'app-dashboard-cfi',
    templateUrl: 'cfi.component.html',
    styleUrls: ['./cfi.component.scss'],
})
export class CFIComponent implements OnInit {
    @Input() user: User;

    private subs: Subscription[] = [];

    constructor(private modalService: BsModalService) {}

    ngOnInit(): void {}

    addInvoice(): void {
        const invcRef = this.modalService.show(AddInvoiceComponent);
        invcRef.content.action.subscribe((success) => {
            // if(success){
            //     //something
            // }
            invcRef.hide();
        });
    }

    addPayment(): void {
        const pymtRef = this.modalService.show(AddPaymentComponent);
        pymtRef.content.action.subscribe((success) => {
            // if(success){
            //     //something
            // }
            pymtRef.hide();
        });
    }
}
