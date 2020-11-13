import { NavigationEnd } from '@angular/router';
import { Aircraft } from './../aircraft/aircraft.service';
import { Injectable } from '@angular/core';
import { UserService, User } from '../user/user.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { AircraftService } from '../aircraft/aircraft.service';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BackendEvent {
    id: number;
    title: string;
    owner: number;
    start: string;
    end: string;
    data: {
        resources: number[];
        color: number;
    };
}

export interface CalendarEvent {
    id: number;
    start: moment.Moment;
    end: moment.Moment;
    title: string;
    owner: number;
    resourceIds: number[];
    editable: boolean;
    color: number;
}

export interface CalendarResource {
    id: number;
    type: string;
    title: string;
}

@Injectable({
    providedIn: 'root',
})
export class ScheduleService {
    private user: User;
    private resources: {};

    constructor(
        private http: HttpClient,
        private userService: UserService,
        private aircraftService: AircraftService
    ) {
        this.resources = {};
        this.userService.currentUser.subscribe((user: User) => {
            this.user = user;
        });
        this.userService.allUsers.subscribe((users: User[]) => {
            users
                .filter((u) => {
                    return u.groups.includes('Flight Instructor');
                })
                .forEach((c) => {
                    const days = {};
                    c.data.availability.forEach((a) => {
                        a.days.forEach((d) => {
                            days[d] = {
                                start: a.start,
                                end: a.end,
                            };
                        });
                    });
                    this.resources[c.id] = days;
                });
        });
        this.aircraftService.allAircraft.subscribe((acft: Aircraft[]) => {
            acft.filter((a) => {
                return a.model.rate > 0;
            }).forEach((r) => {
                const days = {};
                r.model.availability.forEach((a) => {
                    a.days.forEach((d) => {
                        days[d] = {
                            start: a.start,
                            end: a.end,
                        };
                    });
                });

                this.resources[r.id + 1000] = days;
            });
        });
    }

    availability(id, day, time) {
        let available = false;
        const res = this.resources[id];
        if (res) {
            const d = res[day];
            if (d) {
                if (d.start <= time && time < d.end) {
                    available = true;
                }
            }
        }
        return available;
    }

    getEvents(
        start: moment.Moment,
        end: moment.Moment
    ): Promise<CalendarEvent[]> {
        return new Promise((resolve, reject) => {
            this.http
                .get('/api/event/', {
                    params: {
                        start: start.toISOString(),
                        end: end.toISOString(),
                    },
                })
                .subscribe(
                    (events: BackendEvent[]) => {
                        const evts = [];
                        events.forEach((e) => {
                            evts.push({
                                id: e.id,
                                title: e.title,
                                owner: e.owner,
                                start: moment(e.start),
                                end: moment(e.end),
                                resourceIds: e.data.resources,
                                color: e.data.color,
                                editable: this.canEdit(e.owner),
                                startEditable: this.canEdit(e.owner),
                                durationEditable: this.canEdit(e.owner),
                                resourceEditable: this.canEdit(e.owner),
                            });
                        });
                        resolve(evts);
                    },
                    (error) => {
                        reject();
                    }
                );
        });
    }

    canEdit(owner) {
        if (this.user) {
            return (
                this.user.id === owner ||
                this.user.groups.includes('Flight Instructor')
            );
        } else {
            return false;
        }
    }

    save(event: CalendarEvent) {
        return new Promise<number>((resolve, reject) => {
            const evnt = {
                id: event.id,
                title: event.title,
                owner: event.owner,
                start: event.start,
                end: event.end,
                data: {
                    resources: event.resourceIds,
                    color: event.color,
                },
            };
            console.log(evnt);
            if (evnt.id) {
                console.log('putting');
                this.http.put('/api/event/' + evnt.id + '/', evnt).subscribe(
                    (e) => {
                        resolve();
                    },
                    (err) => {
                        reject(err);
                    }
                );
            } else {
                console.log('posting');
                this.http.post('/api/event/', evnt).subscribe(
                    (e) => {
                        resolve();
                    },
                    (err) => {
                        reject(err);
                    }
                );
            }
        });
    }

    delete(id) {
        return new Promise<number>((resolve, reject) => {
            this.http.delete('/api/event/' + id + '/').subscribe(
                (e) => {
                    resolve();
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }

    validate(event) {
        return new Promise<boolean>((resolve, reject) => {
            this.http.post('/api/event/validate/', event).subscribe(
                (valid) => {
                    if (valid) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                },
                (err) => {
                    reject(false);
                }
            );
        });
    }
}
