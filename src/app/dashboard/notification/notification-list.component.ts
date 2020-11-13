import { Component, OnInit } from '@angular/core';
import { NotifyService, Notify } from '../../shared/services/notify.service';

@Component({
    templateUrl: 'notification-list.html',
    styleUrls: ['./notification.scss'],
})
export class NotificationListComponent implements OnInit {
    notifications: Notify[];

    constructor(private notifyService: NotifyService) {}

    ngOnInit(): void {
        this.notifyService.current.subscribe((n: Notify[]) => {
            this.notifications = n;
        });
    }
}
