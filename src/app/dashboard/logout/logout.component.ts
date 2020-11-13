import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from 'src/app/user/user.service';

@Component({
    templateUrl: 'logout.html',
    styleUrls: ['./logout.scss'],
})
export class LogoutComponent implements OnInit {
    constructor(private authService: AuthService) {}
    ngOnInit() {
        this.authService.logout();
    }
}
