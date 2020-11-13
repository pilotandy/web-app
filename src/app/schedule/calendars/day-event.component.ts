import { CalendarEvent } from './../schedule.service';
import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ElementRef,
    AfterViewInit,
    Renderer2,
} from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'app-day-event',
    templateUrl: './day-event.component.html',
})
export class DayEventComponent implements OnInit, AfterViewInit {
    @Input() event: CalendarEvent;
    @Input() resource: number;
    @Input() cells: any;
    @Input() date: moment.Moment;
    @ViewChild('eventRef') ref: ElementRef;

    constructor(private renderer: Renderer2) {}

    ngOnInit() {}

    ngAfterViewInit() {
        const sid =
            moment(this.event.start).valueOf().toString() +
            ':' +
            this.resource.toString();
        const eid =
            moment(this.event.end).valueOf().toString() +
            ':' +
            this.resource.toString();

        let scell = this.cells[sid];
        let ecell = this.cells[eid];

        let startClass = 'evt-begin';
        let endClass = 'evt-end';

        if (!scell) {
            const newStart = moment(this.date).startOf('day');
            scell = this.cells[
                moment(newStart).valueOf().toString() +
                    ':' +
                    this.resource.toString()
            ];
            startClass = null;
        }

        if (!ecell) {
            const newEnd = moment(this.date)
                .endOf('day')
                .set({ minutes: 30, seconds: 0, milliseconds: 0 });
            ecell = this.cells[
                moment(newEnd).valueOf().toString() +
                    ':' +
                    this.resource.toString()
            ];
            endClass = null;
        }

        const top = scell.y + 1;
        const left = scell.x + 10;
        const width = scell.w - 20;
        let height = ecell.y - scell.y - 1;

        if (!endClass) {
            height += scell.h;
        }

        this.renderer.setStyle(this.ref.nativeElement, 'top', `${top}px`);
        this.renderer.setStyle(this.ref.nativeElement, 'left', `${left}px`);
        this.renderer.setStyle(this.ref.nativeElement, 'width', `${width}px`);
        this.renderer.setStyle(this.ref.nativeElement, 'height', `${height}px`);
        this.renderer.addClass(
            this.ref.nativeElement,
            `evt-color-${this.event.color}`
        );
        if (startClass) {
            this.renderer.addClass(this.ref.nativeElement, startClass);
        }
        if (endClass) {
            this.renderer.addClass(this.ref.nativeElement, endClass);
        }
    }
}
