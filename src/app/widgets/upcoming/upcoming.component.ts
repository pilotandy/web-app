import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService, User } from 'src/app/user/user.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import {
    CalendarEvent,
    ScheduleService,
} from 'src/app/schedule/schedule.service';

@Component({
    selector: 'app-upcoming',
    templateUrl: 'upcoming.html',
    styleUrls: ['./upcoming.scss'],
})
export class UpcomingComponent implements OnInit, OnDestroy {
    @Input() max: number;
    @Input() all = false;
    events: CalendarEvent[] = [];

    private subs: Subscription[] = [];

    constructor(
        private userService: UserService,
        private scheduleService: ScheduleService
    ) {}

    ngOnInit(): void {
        this.subs.push(
            this.userService.currentUser.subscribe((u) => {
                const start = moment(moment().format('YYYY-MM-DDTHH:mm:ssZ'));
                const end = moment(start).add(1, 'months');
                this.scheduleService.getEvents(start, end).then(
                    (events: CalendarEvent[]) => {
                        this.events = [];
                        const now = moment();
                        events.forEach((e) => {
                            const s = moment(e.start);
                            if (
                                u.id === e.owner ||
                                (e.resourceIds.find((id) => u.id === id) &&
                                    s > now)
                            ) {
                                if (this.events.length < 10) {
                                    this.events.push(e);
                                }
                            }
                        });

                        // Sort the events
                        this.events = this.events.sort(
                            (a: CalendarEvent, b: CalendarEvent) => {
                                if (moment(a.start) < moment(b.start)) {
                                    return -1;
                                } else if (moment(a.start) > moment(b.start)) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            }
                        );

                        // Limit events
                        if (this.max) {
                            this.events = this.events.slice(0, this.max);
                        }
                    },
                    (error) => {}
                );
            })
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }
}
