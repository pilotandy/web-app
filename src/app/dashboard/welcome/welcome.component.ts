import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/user/user.service';

@Component({
    selector: 'app-dashboard-welcome',
    templateUrl: 'welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
    @Input() user: User;
    constructor() {}

    ngOnInit(): void {}
}
