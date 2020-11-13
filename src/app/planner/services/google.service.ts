import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GoogleService {
    constructor() {
        const script = document.createElement('script');
        script.src =
            '//maps.googleapis.com/maps/api/js?libraries=places&key=' +
            environment.googleMapsKey;
        document.head.appendChild(script);
    }

    waitForGoogle(observer) {
        if (typeof google !== 'undefined') {
            observer.next(google);
        } else {
            setTimeout(() => {
                this.waitForGoogle(observer);
            }, 250);
        }
    }

    ready() {
        return new Observable<google.maps.Map>((observer) => {
            this.waitForGoogle(observer);
        });
    }
}
