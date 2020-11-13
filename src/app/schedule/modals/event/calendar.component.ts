import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

export interface Day {
    date: moment.Moment;
    class: string;
}

@Component({
    selector: 'app-evt-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.css'],
})
export class EvtCalendarComponent implements OnInit {
    @Input() date: moment.Moment;
    @Output() changed = new EventEmitter<moment.Moment>();
    days: Day[];
    temp: moment.Moment;

    state = {
        show: false,
    };

    constructor() {}

    ngOnInit() {
        this.temp = this.date;
        this.buildCalendar();
    }

    buildCalendar() {
        this.days = [];
        const year = moment(this.temp).year();
        const month = moment(this.temp).month();
        const tz = moment().format('Z');

        const date = new Date(year, month, 1, 0, 0, 0);
        const dow = date.getDay();
        const dim = new Date(year, month + 1, 0).getDate();
        let day = new Date(year, month, 0).getDate();

        // The days of the previous month
        for (let i = dow - 1; i > -1; i--) {
            let classStr = 'other';
            const results = this.buildDateClass(year, month, day, tz);
            classStr += results[1];
            this.days.unshift({ date: results[0], class: classStr });
            day--;
        }

        // The days of the current month
        for (let d = 0; d < dim; d++) {
            const results = this.buildDateClass(year, month + 1, d + 1, tz);
            this.days.push({ date: results[0], class: results[1] });
        }

        // The days of the next month
        let dinm = 1;
        const daycnt = this.days.length % 7;
        if (daycnt > 0) {
            for (let j = daycnt; j < 7; j++) {
                let classStr = 'other';
                const results = this.buildDateClass(year, month + 2, dinm, tz);
                classStr += results[1];
                this.days.push({ date: results[0], class: classStr });
                dinm++;
            }
        }
    }

    buildDateClass(year, month, day, tz): [moment.Moment, string] {
        const today = moment();
        let dateStr = year.toString().padStart(4, '0');
        dateStr += '-' + month.toString().padStart(2, '0');
        dateStr += '-' + day.toString().padStart(2, '0');
        dateStr += 'T00:00:00' + tz;
        const t = moment(dateStr, 'YYYY-MM-DDTHH:mm:ssZ');
        let classStr = '';
        if (t.isSame(this.temp, 'day')) {
            classStr += ' selected';
        }
        if (t.isSame(today, 'day')) {
            classStr += ' today';
        }
        return [t, classStr];
    }

    showCalendar() {
        this.state.show = true;
    }

    hideCalendar() {
        this.state.show = false;
    }

    subMonth() {
        this.temp = moment(this.temp).subtract(1, 'month');
        this.buildCalendar();
    }

    subHour() {
        this.temp = moment(this.temp).subtract(1, 'hours');
        this.buildCalendar();
    }

    subMin() {
        this.temp = moment(this.temp).subtract(30, 'minutes');
        this.buildCalendar();
    }

    addMonth() {
        this.temp = moment(this.temp).add(1, 'month');
        this.buildCalendar();
    }

    addHour() {
        this.temp = moment(this.temp).add(1, 'hours');
        this.buildCalendar();
    }

    addMin() {
        this.temp = moment(this.temp).add(30, 'minutes');
        this.buildCalendar();
    }

    selectDay(day) {
        this.temp = moment(day);
        this.buildCalendar();
    }

    onSave() {
        this.date = moment(this.temp);
        this.state.show = false;
        this.changed.next(this.date);
    }

    onCancel() {
        this.temp = moment(this.date);
        this.state.show = false;
    }
}
