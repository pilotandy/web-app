import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/user/user.service';

@Component({
    selector: 'app-dashboard-ppl',
    templateUrl: 'ppl.component.html',
    styleUrls: ['./ppl.component.scss'],
})
export class PPLComponent implements OnInit {
    @Input() user: User;
    constructor() {}

    ngOnInit(): void {}
}
