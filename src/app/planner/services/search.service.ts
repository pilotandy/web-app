import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private http: HttpClient) {}

  search(address: string) {
    const params = new HttpParams({
      fromObject: {
        key: 'AIzaSyBW6nRL1pVqIcJoxVdZPVX3O96PkQ8bFGo',
        address: address
      }
    });
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: params
    });
  }
}
