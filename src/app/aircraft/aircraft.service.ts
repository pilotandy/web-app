import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService, User } from '../user/user.service';

export interface Aircraft {
    id: number;
    name: string;
    owner: number;
    model: {
        arm: number;
        name: string;
        rate: number;
        type: any;
        empty: number;
        thumbnail: string;
        availability?: any[];
    };
}

@Injectable({
    providedIn: 'root',
})
export class AircraftService {
    private allAircraftSubject: BehaviorSubject<Aircraft[]>;
    public allAircraft: Observable<Aircraft[]>;

    constructor(private http: HttpClient, private userService: UserService) {
        this.allAircraftSubject = new BehaviorSubject<Aircraft[]>([]);
        this.allAircraft = this.allAircraftSubject.asObservable();
        this.userService.currentUser.subscribe((user: User) => {
            this.http.get('/api/aircraft/').subscribe(
                (all: Aircraft[]) => {
                    this.allAircraftSubject.next(all);
                },
                (error) => {
                    this.allAircraftSubject.next([]);
                }
            );
        });
    }
}
