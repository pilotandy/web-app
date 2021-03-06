import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface NotifyBackend {
    id: number;
    title: string;
    text: string;
    viewed: boolean;
    date: string;
}

export interface Notify {
    id: number;
    title: string;
    text: string;
    viewed: boolean;
    date: moment.Moment;
}

export interface NotifyType {
    id: number;
    sid: string;
    name: string;
}

@Injectable()
export class NotifyService implements OnDestroy {
    private allNotify: BehaviorSubject<Notify[]>;
    public current: Observable<Notify[]>;
    public intObservable: Observable<Notify[]>;
    private stopPolling = new Subject();

    constructor(private http: HttpClient) {
        this.allNotify = new BehaviorSubject<Notify[]>([]);
        this.current = this.allNotify.asObservable();
        // this.intObservable = timer(1, 5000).pipe(
        //     switchMap(() => http.get<Notify[]>('/api/notify/')),
        //     retry(),
        //     share(),
        //     takeUntil(this.stopPolling),
        //     map((notifys: Notify[]) => {
        //         notifys.forEach((n) => {
        //             n.date = moment(n.date);
        //         });
        //         // this.allNotify.next(notifys);
        //         return notifys;
        //     })
        // );
    }

    ngOnDestroy() {
        this.stopPolling.next();
    }

    types() {
        return new Promise<NotifyType[]>((resolve, reject) => {
            this.http.get('/api/notify/types/').subscribe(
                (nts: NotifyType[]) => {
                    resolve(nts);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }

    get(id: string) {
        return new Promise<Notify>((resolve, reject) => {
            this.http.get('/api/notify/' + id + '/').subscribe(
                (n: Notify) => {
                    n.date = moment(n.date);
                    resolve(n);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }
}
