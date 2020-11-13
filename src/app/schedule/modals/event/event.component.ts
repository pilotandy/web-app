import { Subscription } from 'rxjs';
import {
    CalendarEvent,
    CalendarResource,
    ScheduleService,
} from 'src/app/schedule/schedule.service';
import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnDestroy,
} from '@angular/core';
import { User, UserService } from 'src/app/user/user.service';
import * as moment from 'moment';
import { WaitState } from 'src/app/shared/components/waiting.component';

@Component({
    selector: 'app-event',
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.css'],
})
export class EventComponent implements OnInit, OnDestroy {
    @Input() event: CalendarEvent;
    @Input() resources: CalendarResource[];
    @Input() users: User[];
    @Output() action = new EventEmitter();

    private subs: Subscription[] = [];

    instructors: CalendarResource[];
    aircrafts: CalendarResource[];

    colors = [];

    instructor: number;
    aircraft: number;
    invalid = false;

    stateSave: WaitState;
    stateDelete: WaitState;

    constructor(
        private calendarService: ScheduleService,
        private userService: UserService
    ) {
        this.colors = ['Red', 'Yellow', 'Green', 'Blue', 'Purple'];
    }

    ngOnInit() {
        this.instructors = [];
        this.aircrafts = [];
        this.instructor = null;
        this.aircraft = null;
        this.resources.forEach((r) => {
            if (r.type === 'cfi') {
                this.instructors.push(r);
                if (this.event.resourceIds.indexOf(r.id) >= 0) {
                    this.instructor = r.id;
                }
            }
            if (r.type === 'aircraft') {
                this.aircrafts.push(r);
                if (this.event.resourceIds.indexOf(r.id) >= 0) {
                    this.aircraft = r.id;
                }
            }
        });
        this.subs.push(
            this.userService.currentUser.subscribe((user) => {
                if (!user.groups.includes('Flight Instructor')) {
                    this.users = [user];
                }
            })
        );
        this.stateSave = WaitState.idle;
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    valid() {
        return (
            moment(this.event.start).diff(moment(this.event.end)) < 0 &&
            (this.instructor != null || this.aircraft != null) &&
            this.event.title !== ''
        );
    }

    onCancel() {
        this.action.next(false);
        this.action.complete();
    }

    onSave() {
        this.stateSave = WaitState.wait;
        this.invalid = false;
        this.event.resourceIds = [];
        if (this.instructor) {
            this.event.resourceIds.push(this.instructor);
        }
        if (this.aircraft) {
            this.event.resourceIds.push(this.aircraft);
        }
        this.calendarService.validate(this.event).then(
            (valid) => {
                this.invalid = false;
                this.calendarService.save(this.event).then(
                    (saved) => {
                        this.stateSave = WaitState.success;
                        setTimeout(() => {
                            this.stateSave = WaitState.idle;
                            this.action.next(true);
                            this.action.complete();
                        }, 250);
                    },
                    (err) => {
                        this.stateSave = WaitState.error;
                        setTimeout(() => {
                            this.stateSave = WaitState.idle;
                        }, 1000);
                    }
                );
            },
            (err) => {
                this.invalid = true;
                this.stateSave = WaitState.idle;
            }
        );
    }

    onDelete() {
        this.stateDelete = WaitState.wait;
        this.calendarService.delete(this.event.id).then(
            () => {
                this.stateDelete = WaitState.success;
                setTimeout(() => {
                    this.stateDelete = WaitState.idle;
                    this.action.next(true);
                    this.action.complete();
                }, 250);
            },
            () => {
                this.stateDelete = WaitState.error;
                setTimeout(() => {
                    this.stateDelete = WaitState.idle;
                }, 1000);
            }
        );
    }

    onStartChanged(dt: moment.Moment) {
        this.event.start = moment(dt);
    }

    onEndChanged(dt: moment.Moment) {
        this.event.end = moment(dt);
    }
}
