import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Waypoint } from './waypoint.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GeoService } from './geo.service';
// import {
//     WaypointDetailComponent,
//     WaypointDetailAction,
// } from '../_modals/waypoint-detail/waypoint-detail.component';
// import { NavLogDetailComponent } from '../_modals/nav-log-detail/nav-log-detail.component';
// import { NavLogSelectorComponent } from '../_modals/nav-log-selector/nav-log-selector.component';

export interface RouteWaypoint {
    type: string;
    icao: string;
    name: string;
    elevation: number;
    lat: number;
    lng: number;
    marker: google.maps.Marker;
}

export interface Route {
    id: number;
    name: string;
    waypoints: RouteWaypoint[];
}

@Injectable({
    providedIn: 'root',
})
export class RouteService {
    route: Route;
    render: BehaviorSubject<RouteWaypoint[]>;
    private map: google.maps.Map;

    constructor(
        private geoService: GeoService,
        private modalService: BsModalService,
        private http: HttpClient
    ) {
        this.route = { id: null, name: '', waypoints: [] };
        this.render = new BehaviorSubject([]);
    }

    setMap(map: google.maps.Map) {
        this.map = map;
        this.route.waypoints.forEach((w) => {
            w.marker.setMap(this.map);
        });
    }

    getRoutes() {
        return this.http.get('/api/flight/route/');
    }

    saveRoute() {
        const route = this.routeRemoveMarkers(this.route);
        this.http.post('/api/flight/route/', route).subscribe((r) => {
            this.loadRoute(r);
        });
    }

    deleteRoute() {
        let params = new HttpParams();
        params = params.append('id', this.route.id.toString());
        this.http
            .delete('/api/flight/route/' + this.route.id + '/')
            .subscribe((results) => {
                this.clearRoute();
            });
    }

    routeRemoveMarkers(route: Route) {
        const r = {
            id: route.id,
            name: route.name,
            waypoints: [],
        };
        route.waypoints.forEach((waypoint) => {
            const { marker, ...wp } = waypoint;
            r.waypoints.push(wp);
        });
        return r;
    }

    convertToRoute(waypoint: Waypoint) {
        const marker = new google.maps.Marker({
            position: new google.maps.LatLng(waypoint.lat, waypoint.lng),
            draggable: waypoint.type === 'gps',
            title: waypoint.name,
            map: this.map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: 'white',
                fillOpacity: 1.0,
                strokeColor: '#0088ff',
                strokeOpacity: 1.0,
                strokeWeight: 5,
            },
        });

        const routeWaypoint: RouteWaypoint = {
            type: waypoint.type,
            icao: waypoint.icao,
            name: waypoint.name,
            elevation: waypoint.elevation,
            lat: waypoint.lat,
            lng: waypoint.lng,
            marker,
        };

        marker.addListener('drag', (event: google.maps.MouseEvent) =>
            this.onDrag(routeWaypoint, event)
        );

        marker.addListener('click', (event: google.maps.MouseEvent) =>
            this.onClick(routeWaypoint, event)
        );

        return routeWaypoint;
    }

    addWaypoint(waypoint: Waypoint) {
        const w = this.convertToRoute(waypoint);
        const lat = w.lat;
        const lng = w.lng;
        if (this.route.waypoints.length > 1) {
            let i1: number;
            let d1: number;
            let i2: number;
            let d2: number;
            let d = 7000;
            for (let i = 0; i < this.route.waypoints.length; i++) {
                const wpd = this.geoService.distance(
                    lat,
                    lng,
                    this.route.waypoints[i].lat,
                    this.route.waypoints[i].lng
                );
                if (d > wpd) {
                    d = wpd;
                    i1 = i;
                    d1 = d;
                }
            }
            d = 7000;
            for (let i = 0; i < this.route.waypoints.length; i++) {
                const wpd = this.geoService.distance(
                    lat,
                    lng,
                    this.route.waypoints[i].lat,
                    this.route.waypoints[i].lng
                );
                if (wpd < d && i !== i1) {
                    d = wpd;
                    i2 = i;
                    d2 = d;
                }
            }
            const d3 = this.geoService.distance(
                this.route.waypoints[i1].lat,
                this.route.waypoints[i1].lng,
                this.route.waypoints[i2].lat,
                this.route.waypoints[i2].lng
            );
            if (d2 > d3) {
                if (i1 < i2) {
                    if (i1 > 0) {
                        this.route.waypoints.splice(i1, 0, w);
                    } else {
                        this.route.waypoints.unshift(w);
                    }
                } else {
                    if (i1 < this.route.waypoints.length - 1) {
                        this.route.waypoints.splice(i1 + 1, 0, w);
                    } else {
                        this.route.waypoints.push(w);
                    }
                }
            } else {
                if (i1 < i2) {
                    this.route.waypoints.splice(i2, 0, w);
                } else {
                    this.route.waypoints.splice(i1, 0, w);
                }
            }
        } else {
            this.route.waypoints.push(w);
        }
        this.render.next(this.route.waypoints);
    }

    onDrag(routeWaypoint: RouteWaypoint, event: google.maps.MouseEvent) {
        event.stop();
        routeWaypoint.lat = event.latLng.lat();
        routeWaypoint.lng = event.latLng.lng();
        routeWaypoint.name = this.geoService.decimalToDMS(
            routeWaypoint.lat,
            routeWaypoint.lng
        );
        routeWaypoint.marker.setTitle(routeWaypoint.name);
        this.render.next(this.route.waypoints);
    }

    onClick(routeWaypoint: RouteWaypoint, event: google.maps.MouseEvent) {
        // const modalRef = this.modalService.show(WaypointDetailComponent, {
        //     initialState: {
        //         routeWaypoint,
        //     },
        // });
        // modalRef.content.action.subscribe(
        //     (action: WaypointDetailAction) => {
        //         if (action.action === 'delete') {
        //             this.route.waypoints = this.route.waypoints.filter(
        //                 (waypoint) => {
        //                     if (waypoint !== action.waypoint) {
        //                         return true;
        //                     } else {
        //                         action.waypoint.marker.setMap(null);
        //                         return false;
        //                     }
        //                 }
        //             );
        //         }
        //     },
        //     (error) => {},
        //     () => {
        //         modalRef.hide();
        //         this.render.next(this.route.waypoints);
        //     }
        // );
    }

    clearRoute() {
        this.route.id = null;
        this.route.name = '';
        this.route.waypoints.forEach((waypoint) => {
            waypoint.marker.setMap(null);
        });
        this.route.waypoints = [];
        this.render.next(this.route.waypoints);
    }

    loadRoute(route) {
        this.clearRoute();
        this.route.id = route.id;
        this.route.name = route.name;
        this.route.waypoints = [];
        route.waypoints.forEach((waypoint) => {
            this.route.waypoints.push(this.convertToRoute(waypoint));
        });
        this.render.next(this.route.waypoints);
    }

    showNavLog() {
        if (this.route.waypoints.length > 0) {
            // const modalRef = this.modalService.show(NavLogDetailComponent, {
            //     initialState: {
            //         route: this.route,
            //         environment: {
            //             altitude: 9500,
            //         },
            //     },
            //     class: 'modal-xl',
            // });
            // modalRef.content.action.subscribe((action) => {
            //     this.route = action.route;
            //     if (action.action === 'change') {
            //         this.render.next(this.route.waypoints);
            //     } else if (action.action === 'save') {
            //         this.saveRoute();
            //     } else if (action.action === 'delete') {
            //         this.deleteRoute();
            //     }
            // });
        } else {
            // const req = this.getRoutes();
            // const modalRef = this.modalService.show(NavLogSelectorComponent, {
            //     initialState: {
            //         request: req,
            //     },
            //     class: 'modal-lg',
            // });
            // modalRef.content.routeChange.subscribe((route) => {
            //     this.loadRoute(route);
            // });
        }
    }
}
