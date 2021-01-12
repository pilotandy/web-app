import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    Waypoint,
    WaypointService,
    WaypointsRequest,
} from '../../services/waypoint.service';

@Component({
    selector: 'app-waypoint-selector',
    templateUrl: './waypoint-selector.html',
    styleUrls: [],
})
export class WaypointSelectorComponent implements OnInit {
    @Input() point: WaypointsRequest;
    @Output() waypointSelected: EventEmitter<Waypoint>;

    waypoints: Waypoint[];

    constructor(private waypointService: WaypointService) {}

    ngOnInit() {
        this.waypointSelected = new EventEmitter();
        this.waypointService.getNearestWaypoints(this.point).subscribe(
            (waypoints: Waypoint[]) => {
                this.waypoints = waypoints;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    onSelect(waypoint: Waypoint) {
        this.waypointSelected.emit(waypoint);
        this.waypointSelected.complete();
    }
}
