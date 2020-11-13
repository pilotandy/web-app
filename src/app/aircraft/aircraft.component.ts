import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AircraftService, Aircraft } from './aircraft.service';

@Component({
    selector: 'app-aircraft',
    templateUrl: './aircraft.component.html',
})
export class AircraftComponent implements OnInit, OnDestroy {
    aircraft: Aircraft[];

    private subs: Subscription[] = [];

    constructor(private aircraftService: AircraftService) {}

    ngOnInit(): void {
        this.subs.push(
            this.aircraftService.allAircraft.subscribe((a: Aircraft[]) => {
                this.aircraft = a;
            })
        );
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }
}
