import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/user/user.service';

@Component({
    selector: 'app-lessons-ppl',
    templateUrl: 'ppl-lessons.component.html',
    styleUrls: ['../school.component.scss'],
})
export class PPLLessonsComponent implements OnInit {
    @Input() user: User;

    lessons = [
        {
            id: 0,
            title: 'Introduction to Aviation',
            image: '',
            pages: [],
        },
        {
            id: 1,
            title: 'Aerodynamics',
            image: '',
            pages: [],
        },
        {
            id: 2,
            title: 'Preparing for your Checkride',
            image: '',
            pages: [],
        },
    ];

    selectedLesson: null;

    constructor() {}

    ngOnInit(): void {}

    onChangeLesson(lesson) {
        this.selectedLesson = lesson;
    }
}
