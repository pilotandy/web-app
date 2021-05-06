import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class PaymentService {
    constructor(private http: HttpClient) {}

    submitPayment(amount, total, nonce, key): Promise<string> {
        return new Promise((resolve, reject) => {
            this.http
                .post<string>('/api/payment/', { amount, total, nonce, key })
                .subscribe(
                    (result) => {
                        resolve(result);
                    },
                    (error) => {
                        console.log(error.error);
                        reject('Failed to submit the payment:\n' + error.error);
                    }
                );
        });
    }
}
