import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';

export enum WaitState {
    idle = 0,
    wait = 1,
    success = 2,
    error = 3,
}

@Component({
    selector: 'app-waiting',
    templateUrl: './waiting.component.html',
})
export class WaitingComponent implements OnInit {
    @Input() state: WaitState;
    constructor() {}
    ngOnInit() {}
}
