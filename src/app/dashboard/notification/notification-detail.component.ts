import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotifyService, Notify } from '../../shared/services/notify.service';

@Component({
    templateUrl: 'notification-detail.html',
    styleUrls: ['./notification.scss'],
})
export class NotificationDetailComponent implements OnInit, OnDestroy {
    notification: Notify;

    private subs: Subscription[] = [];

    constructor(
        private notifyService: NotifyService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.subs.push(
            this.route.params.subscribe((params) => {
                if (params.id) {
                    this.notifyService.get(params.id).then((n) => {
                        this.notification = n;
                    });
                }
            })
        );
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }
}
