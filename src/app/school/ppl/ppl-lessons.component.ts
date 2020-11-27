import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/user/user.service';

@Component({
    selector: 'app-lessons-ppl',
    templateUrl: 'ppl-lessons.component.html',
})
export class PPLLessonsComponent implements OnInit {
    @Input() user: User;

    lessons = [
        {
            title: 'Introduction to Aviation',
            image: '',
            pages: [],
        },
    ];

    constructor() {}

    ngOnInit(): void {}
}
