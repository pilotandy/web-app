import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleService } from './google.service';

export interface BaseMap {
    id: string;
    displayName: string;
    selected: boolean;
    obj: any;
}

@Injectable({
    providedIn: 'root',
})
export class BaseMapService {
    private baseMapListSubject: BehaviorSubject<{}[]>;
    public baseMapList: Observable<{}[]>;

    private vfrOptions;
    private ifrOptions;
    private baseMaps;

    private getNormalizedCoord(coord, zoom) {
        const y = coord.y;
        let x = coord.x;
        // tile range in one direction range is dependent on zoom level
        // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
        const tileRange = 2 ** zoom;
        // don't repeat across y-axis (vertically)
        if (y < 0 || y >= tileRange) {
            return null;
        }
        // repeat across x-axis
        if (x < 0 || x >= tileRange) {
            x = ((x % tileRange) + tileRange) % tileRange;
        }
        return {
            x,
            y,
        };
    }

    constructor(
        private http: HttpClient,
        private googleService: GoogleService
    ) {
        this.baseMapListSubject = new BehaviorSubject<{}[]>([]);
        this.baseMapList = this.baseMapListSubject.asObservable();
        // this.http.get('/api/flight/basemaps/').subscribe(
        //   results => {
        //     console.log(results);
        //   },
        //   error => {
        //     console.log(error);
        //     this.baseMapListSubject.next(this.baseMaps);
        //   }
        // );
        this.googleService.ready().subscribe((google) => {
            this.load(google);
            this.baseMapListSubject.next(this.baseMaps);
        });
    }

    load(google) {
        this.vfrOptions = {
            tileSize: new google.maps.Size(256, 256),
            maxZoom: 11,
            minZoom: 5,
            radius: 1738000,
            name: 'VFR',
            getTileUrl: (coord, zoom) => {
                const normalizedCoord = this.getNormalizedCoord(coord, zoom);
                if (!normalizedCoord) {
                    return null;
                }
                const bound = Math.pow(2, zoom);
                return (
                    'https://cdn.pilotandy.com/maptiles/current/sec/' +
                    20180824 +
                    '/' +
                    zoom +
                    '/' +
                    normalizedCoord.x +
                    '/' +
                    (bound - normalizedCoord.y - 1) +
                    '.jpg'
                );
            },
        };

        this.ifrOptions = {
            tileSize: new google.maps.Size(256, 256),
            maxZoom: 11,
            minZoom: 5,
            radius: 1738000,
            name: 'IFR',
            getTileUrl: (coord, zoom) => {
                const normalizedCoord = this.getNormalizedCoord(coord, zoom);
                if (!normalizedCoord) {
                    return null;
                }
                const bound = Math.pow(2, zoom);
                return (
                    'https://cdn.pilotandy.com/maptiles/current/lei/' +
                    20180719 +
                    '/' +
                    zoom +
                    '/' +
                    normalizedCoord.x +
                    '/' +
                    (bound - normalizedCoord.y - 1) +
                    '.jpg'
                );
            },
        };

        this.baseMaps = [
            {
                displayName: 'Google Satellite',
                id: google.maps.MapTypeId.SATELLITE,
                selected: false,
            },
            {
                displayName: 'Google Street',
                id: google.maps.MapTypeId.ROADMAP,
                selected: false,
            },
            {
                displayName: 'Google Terrain',
                id: google.maps.MapTypeId.TERRAIN,
                selected: false,
            },
            {
                displayName: 'VFR Sectional',
                id: 'vfr',
                obj: new google.maps.ImageMapType(this.vfrOptions),
                selected: true,
            },
            {
                displayName: 'IFR Enroute',
                id: 'ifr',
                obj: new google.maps.ImageMapType(this.ifrOptions),
                selected: false,
            },
        ];
    }
}
