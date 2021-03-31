import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ScheduleService, CalendarEvent } from './../schedule.service';
import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    ViewChildren,
    QueryList,
    ElementRef,
    OnChanges,
    AfterViewInit,
} from '@angular/core';
import * as moment from 'moment';
import { EventComponent } from '../modals/event/event.component';
import { UserService, User } from 'src/app/user/user.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-calendar-day',
    templateUrl: './day.component.html',
})
export class DayCalendarComponent
    implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    private modalRef: BsModalRef;
    @ViewChildren('cell') domCells: QueryList<ElementRef>;
    private cells = {};
    private refreshCells = true;
    user: User;
    users: User[];

    @Input() date: moment.Moment;
    times: moment.Moment[];
    events: CalendarEvent[];
    fetching = true;

    private subs: Subscription[] = [];

    resources = [
        { type: 'cfi', name: 'Andy Craner', id: 1 },
        { type: 'aircraft', name: 'N8081P', id: 1001 },
    ];

    constructor(
        private scheduleService: ScheduleService,
        private bsModalService: BsModalService,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.getEvents();
        this.subs.push(
            this.userService.currentUser.subscribe((user: User) => {
                this.user = user;
            })
        );
        this.subs.push(
            this.userService.allUsers.subscribe((all: User[]) => {
                this.users = all;
            })
        );
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    ngAfterViewInit() {
        this.domCells.changes.subscribe((t) => {
            if (this.refreshCells) {
                this.refreshCells = false;
                this.ngForRendered(true);
            }
        });
        this.ngForRendered(false);
    }

    ngOnChanges() {
        this.times = [];
        let t = moment(this.date.format('YYYY-MM-DDT00:00:00Z'));
        for (let i = 0; i < 48; i++) {
            this.times.push(moment(t));
            t = moment(t.add(30, 'minutes'));
        }
        this.refreshCells = true;
    }

    ngForRendered(fetchEvents: boolean) {
        this.cells = {};
        this.domCells.forEach((c) => {
            this.cells[c.nativeElement.getAttribute('id')] = {
                x: c.nativeElement.offsetLeft,
                y: c.nativeElement.offsetTop % 1056,
                w: c.nativeElement.offsetWidth,
                h: c.nativeElement.offsetHeight,
            };
        });
        if (fetchEvents) {
            this.getEvents();
        }
    }

    isHour(t) {
        return t.format('mm') === '00';
    }

    isAvailable(id, time): boolean {
        const day = time.day();
        const hour = Number(time.format('HHmm'));
        return this.scheduleService.availability(id, day, hour);
    }

    getEvents() {
        const start = moment(this.date.format('YYYY-MM-DDT00:00:00Z'));
        const end = moment(start).add(1, 'days');
        this.fetching = true;
        this.scheduleService.getEvents(start, end).then(
            (events: CalendarEvent[]) => {
                this.events = events;
                this.fetching = false;
            },
            (error) => {
                this.fetching = false;
            }
        );
    }

    onTimeClick(resource: number, time: moment.Moment) {
        if (this.isAvailable(resource, time)) {
            const event: CalendarEvent = {
                id: null,
                start: moment(time),
                end: moment(time).add(2, 'hours'),
                title: '',
                owner: this.user.id,
                resourceIds: [resource],
                color: 1,
                editable: true,
            };
            this.onEditEvent(event);
        }
    }

    onEditEvent(event: CalendarEvent) {
        if (
            event.owner === this.user.id ||
            this.user.groups.includes('Flight Instructor')
        ) {
            this.modalRef = this.bsModalService.show(EventComponent, {
                initialState: {
                    event: JSON.parse(JSON.stringify(event)),
                    resources: this.resources,
                    users: this.users,
                },
                class: 'sm',
            });
            this.modalRef.content.action.subscribe((success: boolean) => {
                if (success) {
                    this.getEvents();
                }
                this.modalRef.hide();
            });
        }
    }

    onClickRefresh() {
        this.getEvents();
    }
}
