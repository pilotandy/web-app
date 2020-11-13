import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeoService {
  constructor() {}

  toRad(d: number) {
    return (d * Math.PI) / 180.0;
  }

  toDeg(r: number) {
    return (r * 180.0) / Math.PI;
  }

  bearing(lat1: number, lng1: number, lat2: number, lng2: number) {
    const lt1 = this.toRad(lat1);
    const lt2 = this.toRad(lat2);
    const dLng = this.toRad(lng2 - lng1);
    const y = Math.sin(dLng) * Math.cos(lt2);
    const x =
      Math.cos(lt1) * Math.sin(lt2) -
      Math.sin(lt1) * Math.cos(lt2) * Math.cos(dLng);
    const brng = Math.atan2(y, x);
    return (this.toDeg(brng) + 360) % 360;
  }

  distance(lat1: number, lng1: number, lat2: number, lng2: number) {
    const r = 3440.06479; // nm
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lng2 - lng1);
    const lt1 = this.toRad(lat1);
    const lt2 = this.toRad(lat2);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lt1) * Math.cos(lt2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = r * c;
    return d;
  }

  midpoint(lat1: number, lng1: number, lat2: number, lng2: number) {
    const dLng = this.toRad(lng2 - lng1);
    const lt1 = this.toRad(lat1);
    const lt2 = this.toRad(lat2);
    const Bx = Math.cos(lat2) * Math.cos(dLng);
    const By = Math.cos(lat2) * Math.sin(dLng);
    const lat3 = this.toDeg(
      Math.atan2(
        Math.sin(lt1) + Math.sin(lt2),
        Math.sqrt((Math.cos(lt1) + Bx) * (Math.cos(lt1) + Bx) + By * By)
      )
    );
    const lng3 = lng1 + this.toDeg(Math.atan2(By, Math.cos(lt1) + Bx));
    return [lat3, lng3];
  }

  endpoint(lat1: number, lng1: number, lat2: number, lng2: number, d: number) {
    const r = 3440.06479; // nm
    const lt1 = this.toRad(lat1);
    const lt2 = this.toRad(lat2);
    const lg1 = this.toRad(lng1);
    const lg2 = this.toRad(lng2);
    const dLng = lg2 - lg1;
    const y = Math.sin(dLng) * Math.cos(lt2);
    const x =
      Math.cos(lt1) * Math.sin(lt2) -
      Math.sin(lt1) * Math.cos(lt2) * Math.cos(dLng);
    const brng = Math.atan2(y, x);
    const lat3 = Math.asin(
      Math.sin(lt1) * Math.cos(d / r) +
        Math.cos(lt1) * Math.sin(d / r) * Math.cos(brng)
    );
    const lng3 =
      lg1 +
      Math.atan2(
        Math.sin(brng) * Math.sin(d / r) * Math.cos(lt1),
        Math.cos(d / r) - Math.sin(lt1) * Math.sin(lat3)
      );
    return [this.toDeg(lat3), this.toDeg(lng3)];
  }

  intersection(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
    lat3: number,
    lng3: number,
    lat4: number,
    lng4: number
  ) {
    const brng1 = this.bearing(lat1, lng1, lat2, lng2);
    const brng2 = this.bearing(lat3, lng3, lat4, lng4);
    const lt1 = this.toRad(lat1);
    const lg1 = this.toRad(lng1);
    const lt2 = this.toRad(lat3);
    const lg2 = this.toRad(lng3);
    const brng13 = this.toRad(brng1);
    const brng23 = this.toRad(brng2);
    const dLat = lt2 - lt1;
    const dLng = lg2 - lg1;
    const dist12 =
      2 *
      Math.asin(
        Math.sqrt(
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lt1) *
              Math.cos(lt2) *
              Math.sin(dLng / 2) *
              Math.sin(dLng / 2)
        )
      );
    if (dist12 === 0) {
      return null;
    }

    // initial/final bearings between points
    let brngA = Math.acos(
      (Math.sin(lt2) - Math.sin(lt1) * Math.cos(dist12)) /
        (Math.sin(dist12) * Math.cos(lt1))
    );
    if (isNaN(brngA)) {
      brngA = 0;
    } // protect against rounding
    const brngB = Math.acos(
      (Math.sin(lt1) - Math.sin(lt2) * Math.cos(dist12)) /
        (Math.sin(dist12) * Math.cos(lt2))
    );
    let brng12 = 2 * Math.PI - brngA;
    let brng21 = brngB;
    if (Math.sin(lg2 - lg1) > 0) {
      brng12 = brngA;
      brng21 = 2 * Math.PI - brngB;
    }

    const alpha1 = ((brng13 - brng12 + Math.PI) % (2 * Math.PI)) - Math.PI; // angle 2-1-3
    const alpha2 = ((brng21 - brng23 + Math.PI) % (2 * Math.PI)) - Math.PI; // angle 1-2-3

    if (Math.sin(alpha1) === 0 && Math.sin(alpha2) === 0) {
      return null;
    } // infinite intersections
    if (Math.sin(alpha1) * Math.sin(alpha2) < 0) {
      return null;
    } // ambiguous intersection

    const alpha3 = Math.acos(
      -Math.cos(alpha1) * Math.cos(alpha2) +
        Math.sin(alpha1) * Math.sin(alpha2) * Math.cos(dist12)
    );
    const dist13 = Math.atan2(
      Math.sin(dist12) * Math.sin(alpha1) * Math.sin(alpha2),
      Math.cos(alpha2) + Math.cos(alpha1) * Math.cos(alpha3)
    );
    const lt3 = Math.asin(
      Math.sin(lt1) * Math.cos(dist13) +
        Math.cos(lt1) * Math.sin(dist13) * Math.cos(brng13)
    );
    const dLng13 = Math.atan2(
      Math.sin(brng13) * Math.sin(dist13) * Math.cos(lat1),
      Math.cos(dist13) - Math.sin(lat1) * Math.sin(lat3)
    );
    let lg3 = lg1 + dLng13;
    lg3 = ((lng3 + 3 * Math.PI) % (2 * Math.PI)) - Math.PI; // normalise to -180..+180º
    return [this.toDeg(lat3), this.toDeg(lng3)];
  }

  decimalToDMS(lat: number, lng: number) {
    // decimal to DMS for the name
    const ns = lat >= 0 ? 'N' : 'S';
    const ew = lng >= 0 ? 'E' : 'W';
    const latdeg = Math.floor(Math.abs(lat));
    const latrmn = Math.abs(lat) - latdeg;
    const latmin = Math.floor(latrmn * 60);
    const latsec = (latrmn * 60 - latmin) * 60;

    const lngdeg = Math.floor(Math.abs(lng));
    const lngrmn = Math.abs(lng) - lngdeg;
    const lngmin = Math.floor(lngrmn * 60);
    const lngsec = (lngrmn * 60 - lngmin) * 60;

    const dms = [];
    dms.push(
      ns,
      ' ',
      latdeg,
      '&deg; ',
      latmin,
      '&#39; ',
      latsec.toFixed(2),
      '", ',
      ew,
      ' ',
      lngdeg,
      '&deg; ',
      lngmin,
      '&#39; ',
      lngsec.toFixed(2),
      '"'
    );
    return dms.join('');
  }
}
