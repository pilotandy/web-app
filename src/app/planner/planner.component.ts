import { Subscription } from 'rxjs';
import {
    Component,
    OnInit,
    ViewChild,
    AfterViewInit,
    OnDestroy,
    ElementRef,
} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { WaypointsRequest, Waypoint } from './services/waypoint.service';
import { BaseMapService, BaseMap } from './services/basemap.service';
import { RouteService, RouteWaypoint } from './services/route.service';
import { GoogleService } from './services/google.service';
import { WaypointSelectorComponent } from './modals/waypoint/waypoint-selector';

@Component({
    selector: 'app-planner',
    templateUrl: './planner.component.html',
    styleUrls: ['./planner.scss'],
})
export class PlannerComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('gmap') gmapElement: any;
    // @ViewChild('wayPointDialog') wayPointDialogRef: any;
    @ViewChild('searchBox') searchBox: ElementRef;

    private subs: Subscription[] = [];

    map: google.maps.Map;
    baseMaps: BaseMap[] = [];
    modalRef: BsModalRef;

    lat = 36.8665175;
    lng = -91.829994;
    zoomControl = false;

    options = {
        show: false,
        searchResults: [],
    };

    navlog = {
        show: false,
    };

    searchService: google.maps.places.SearchBox;
    flightPath: google.maps.Polyline;

    constructor(
        private googleService: GoogleService,
        private baseMapService: BaseMapService,
        private routeService: RouteService,
        private modalService: BsModalService
    ) {
        this.googleService.ready().subscribe((gmap) => {
            this.flightPath = new google.maps.Polyline({
                path: [],
                strokeColor: '#0088ff',
                strokeOpacity: 1.0,
                strokeWeight: 5,
                geodesic: true,
            });
        });
    }

    ngOnInit() {}

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    ngAfterViewInit() {
        this.subs.push(
            this.googleService.ready().subscribe((gmap) => {
                if (gmap) {
                    const mapProp = {
                        center: new google.maps.LatLng(this.lat, this.lng),
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.TERRAIN,
                        options: {
                            panControl: false,
                            zoomControl: false,
                            overviewMapControl: false,
                            scaleControl: false,
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: false,
                            zoomControlOptions: {
                                style: google.maps.ZoomControlStyle.SMALL,
                                position: google.maps.ControlPosition.TOP_RIGHT,
                            },
                        },
                    };
                    this.map = new google.maps.Map(
                        this.gmapElement.nativeElement,
                        mapProp
                    );
                    this.map.addListener('click', (e) => {
                        this.onMapClick(e);
                    });
                    this.subs.push(
                        this.baseMapService.baseMapList.subscribe(
                            (baseMaps: BaseMap[]) => {
                                this.baseMaps = baseMaps;
                                baseMaps.forEach((baseMap: BaseMap) => {
                                    if (
                                        baseMap.displayName.indexOf('Google') <
                                        0
                                    ) {
                                        this.map.mapTypes.set(
                                            baseMap.id,
                                            baseMap.obj
                                        );
                                    }
                                    if (baseMap.selected) {
                                        this.map.setMapTypeId(baseMap.id);
                                    }
                                });
                            }
                        )
                    );
                    this.searchService = new google.maps.places.SearchBox(
                        this.searchBox.nativeElement
                    );
                    this.searchService.addListener('places_changed', () => {
                        const place = this.searchService.getPlaces()[0];
                        this.map.setCenter(place.geometry.location);
                        this.searchBox.nativeElement.value = '';
                    });
                    // this.routeService.setMap(this.map);
                    // this.flightPath.setMap(this.map);
                    // this.routeService.render.subscribe(
                    //     (route: RouteWaypoint[]) => {
                    //         this.renderFlightPath(route);
                    //     }
                    // );
                }
            })
        );
    }

    toggleOptionsCollapse() {
        this.options.show = !this.options.show;
        if (this.options.show) {
            this.navlog.show = false;
        }
    }

    toggleNavlogCollapse() {
        this.navlog.show = !this.navlog.show;
        if (this.navlog.show) {
            this.options.show = false;
        }
    }

    onMapClick(evt: google.maps.MouseEvent) {
        if (this.options.show) {
            this.options.show = false;
            return;
        }
        if (this.navlog.show) {
            this.navlog.show = false;
            return;
        }
        const point: WaypointsRequest = {
            lat: evt.latLng.lat(),
            lng: evt.latLng.lng(),
            zoom: this.map.getZoom(),
        };
        const modalRef = this.modalService.show(WaypointSelectorComponent, {
            initialState: {
                point,
            },
            class: 'modal-lg',
        });
        modalRef.content.waypointSelected.subscribe((waypoint: Waypoint) => {
            this.routeService.addWaypoint(waypoint);
        });
    }

    onMapTypeSelect(selectedMap: BaseMap) {
        this.baseMaps.forEach((baseMap: BaseMap) => {
            if (baseMap === selectedMap) {
                baseMap.selected = true;
            } else {
                baseMap.selected = false;
            }
        });
        this.map.setMapTypeId(selectedMap.id);
    }

    onShowNavLog() {
        this.routeService.showNavLog();
    }

    renderFlightPath(route: RouteWaypoint[]) {
        if (route.length > 0) {
            const flightPathPoints = [];
            route.forEach((waypoint: RouteWaypoint) => {
                const latlng = new google.maps.LatLng(
                    waypoint.lat,
                    waypoint.lng
                );
                flightPathPoints.push(latlng);
            });
            this.flightPath.setPath(flightPathPoints);
        } else {
            this.flightPath.setPath([]);
        }
    }
}
