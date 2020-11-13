import { GeoService } from './geo.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface WaypointsRequest {
    lat: number;
    lng: number;
    zoom: number;
}

export interface Waypoint {
    type: string;
    icao: string;
    name: string;
    elevation: number;
    lat: number;
    lng: number;
}

@Injectable({
    providedIn: 'root',
})
export class WaypointService {
    constructor(private http: HttpClient, private geoService: GeoService) {}

    getNearestWaypoints(point: WaypointsRequest) {
        return Observable.create((observer) => {
            this.http.post('/api/flight/nearest/', point).subscribe(
                (waypoints: any) => {
                    const gps = {
                        icao: 'GPS',
                        name: this.geoService.decimalToDMS(
                            point.lat,
                            point.lng
                        ),
                        type: 'gps',
                        lat: point.lat,
                        lng: point.lng,
                        elevation: 0,
                    };
                    waypoints['gps'] = [gps];
                    observer.next(waypoints);
                    observer.complete();
                },
                (error) => {
                    observer.error(error);
                }
            );
        });
    }
}
