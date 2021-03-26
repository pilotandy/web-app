import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';

export interface Invoice {
    date: Date;
    items: {
        name: string;
        rate: number;
        quantity: number;
    }[];
    description: string;
}

export interface Payment {
    date: Date;
    amount: number;
}

export interface User {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    groups: string[];
    data: {
        presolo?: boolean;
        availability?: any[];
        image?: string;
        phone?: string;
    };
    invoices: Invoice[];
    payments: Payment[];
    notifications?: any;
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    private allUsersSubject: BehaviorSubject<User[]>;
    public allUsers: Observable<User[]>;

    private anon: User = {
        id: 0,
        email: '',
        firstname: '',
        lastname: '',
        groups: [],
        data: {},
        invoices: [],
        payments: [],
    };

    constructor(private http: HttpClient, private authService: AuthService) {
        this.currentUserSubject = new BehaviorSubject<User>(null);
        this.currentUser = this.currentUserSubject.asObservable();
        this.allUsersSubject = new BehaviorSubject<User[]>([]);
        this.allUsers = this.allUsersSubject.asObservable();
        this.authService.userId.subscribe((id) => {
            if (id) {
                this.getUser(id).subscribe((user: User) => {
                    this.currentUserSubject.next(user);
                    this.getAllUsers();
                });
            } else {
                this.currentUserSubject.next(this.anon);
            }
        });
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public get allUsersValue(): User[] {
        return this.allUsersSubject.value;
    }

    private getUser(userId: number) {
        return this.http.get('/api/users/' + userId + '/');
    }

    public refreshAll() {
        this.getAllUsers();
    }

    public saveUser(user: User) {
        return new Promise<User>((resolve, reject) => {
            this.http.patch('/api/users/' + user.id + '/', user).subscribe(
                (saved: User) => {
                    resolve(saved);
                },
                (err) => {
                    reject(null);
                }
            );
        });
    }

    private getAllUsers() {
        this.http.get('/api/users/').subscribe((all: User[]) => {
            this.allUsersSubject.next(all);
        });
    }
}
