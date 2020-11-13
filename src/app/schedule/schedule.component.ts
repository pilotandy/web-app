import { Subscription } from 'rxjs';
import { AircraftService, Aircraft } from 'src/app/aircraft/aircraft.service';

import {
    ScheduleService,
    CalendarEvent,
    CalendarResource,
} from 'src/app/schedule/schedule.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
// import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { UserService, User } from 'src/app/user/user.service';

@Component({
    templateUrl: './schedule.component.html',
})
export class ScheduleComponent implements OnInit, OnDestroy {
    calendar = {
        resources: [],
        events: [] as CalendarEvent[],
        date: null as moment.Moment,
        view: {
            selected: 'Day',
            options: ['Day', 'Week', 'Month'],
            click: (value) => {
                this.calendar.view.selected = value;
            },
        },
    };

    private user: User;

    private subs: Subscription[] = [];

    constructor(
        private scheduleService: ScheduleService,
        private userService: UserService,
        private aircraftService: AircraftService
    ) {}

    ngOnInit() {
        this.calendar.date = moment();
        this.subs.push(
            this.userService.currentUser.subscribe((user: User) => {
                this.user = user;
                this.calendar.events = [];
            })
        );
        this.calendar.resources = [];
        this.subs.push(
            this.userService.allUsers.subscribe((users: User[]) => {
                this.calendar.resources = this.calendar.resources.filter(
                    (r: CalendarResource) => {
                        return r.type !== 'Instructors';
                    }
                );
                users.forEach((u: User) => {
                    if (u.groups.includes('Flight Instructor')) {
                        this.calendar.resources = this.calendar.resources.concat(
                            {
                                id: u.id,
                                type: 'Instructors',
                                title: u.firstname + ' ' + u.lastname,
                                businessHours: [
                                    {
                                        daysOfWeek: [1, 2, 3, 4, 5], // Weekdays
                                        startTime: '16:30', // 4:30pm
                                        endTime: '21:00', // 9pm
                                    },
                                    {
                                        daysOfWeek: [6], // Saturday
                                        startTime: '08:00', // 8am
                                        endTime: '21:00', // 9pm
                                    },
                                ],
                            }
                        );
                    }
                });
            })
        );
        this.subs.push(
            this.aircraftService.allAircraft.subscribe(
                (aircraft: Aircraft[]) => {
                    this.calendar.resources = this.calendar.resources.filter(
                        (r: CalendarResource) => {
                            return r.type !== 'Aircraft';
                        }
                    );
                    aircraft.forEach((a: Aircraft) => {
                        if (a.model.rate > 0) {
                            this.calendar.resources = this.calendar.resources.concat(
                                {
                                    id: a.id + 1000,
                                    type: 'Aircraft',
                                    title: a.name,
                                }
                            );
                        }
                    });
                }
            )
        );
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    onDatePrev() {
        const unit = this.calendar.view.selected.toLowerCase() + 's';
        const duration = moment.duration(
            1,
            unit as moment.unitOfTime.DurationConstructor
        );
        this.calendar.date = moment(this.calendar.date.subtract(duration));
    }

    startWeek() {
        return moment(this.calendar.date).startOf('week');
    }

    endWeek() {
        return moment(this.calendar.date).endOf('week');
    }

    onDateToday() {
        this.calendar.view.selected = 'Day';
        this.calendar.date = moment();
    }

    onDateNext() {
        const unit = this.calendar.view.selected.toLowerCase() + 's';
        const duration = moment.duration(
            1,
            unit as moment.unitOfTime.DurationConstructor
        );
        this.calendar.date = moment(this.calendar.date.add(duration));
    }

    onDateClick(evt) {
        let resource = this.calendar.resources[0].id;
        if (evt.resource) {
            resource = Number(evt.resource.id);
        }
        const s = moment(evt.date);
        const e = moment(s).add({ hours: 2 });
        const event: CalendarEvent = {
            id: null,
            start: s,
            end: e,
            title: '',
            owner: this.user.id,
            resourceIds: [resource],
            color: 0,
            editable: true,
        };
        this.editEvent(event);
    }

    onEventClick(info) {
        const evt = info.event;
        const event = this.calendar.events.find((e: CalendarEvent) => {
            return e.id === Number(evt.id);
        });
        if (event.editable) {
            this.editEvent(event);
        }
    }

    onEventChange(info) {
        const evt = info.event;
        const event = this.calendar.events.find((e: CalendarEvent) => {
            return e.id === Number(evt.id);
        });
        if (event.editable) {
            event.start = moment(evt.start);
            event.end = moment(evt.end);
            if (info.oldResource && info.newResource) {
                const idx = event.resourceIds.findIndex((r) => {
                    return r === Number(info.oldResource.id);
                });
                event.resourceIds[idx] = Number(info.newResource.id);
            }
            this.scheduleService.save(event);
        }
    }

    editEvent(event) {
        let users = [this.user];
        if (this.user.groups.includes('Flight Instructor')) {
            users = this.userService.allUsersValue;
        }
        // this.modalRef = this.bsModalService.show(EventComponent, {
        //     initialState: {
        //         event,
        //         resources: this.calendar.resources,
        //         users,
        //     },
        //     class: 'sm',
        // });
        // this.modalRef.content.action.subscribe(
        //     (evnt: CalendarEvent) => {
        //         const usr = users.find((u: User) => {
        //             return u.id === evnt.owner;
        //         });
        //         evnt.title = usr.firstname + ' ' + usr.lastname;
        //         this.scheduleService.save(evnt);
        //     },
        //     (id: number) => {
        //         this.scheduleService.delete(id);
        //         this.modalRef.hide();
        //     },
        //     () => {
        //         this.modalRef.hide();
        //     }
        // );
    }
}
