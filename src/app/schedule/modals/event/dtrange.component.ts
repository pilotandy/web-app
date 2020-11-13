import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'app-dtrange',
    templateUrl: './dtrange.component.html',
})
export class DTRangeComponent implements OnInit {
    @Input() start: moment.Moment;
    @Input() end: moment.Moment;
    @Output() startChanged = new EventEmitter<moment.Moment>();
    @Output() endChanged = new EventEmitter<moment.Moment>();

    constructor() {}

    ngOnInit() {}

    onStartChanged(dt) {
        this.startChanged.next(dt);
    }

    onEndChanged(dt) {
        this.endChanged.next(dt);
    }
}
