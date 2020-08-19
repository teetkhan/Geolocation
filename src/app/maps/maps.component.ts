import { Router, NavigationExtras, Navigation } from '@angular/router';
import { Component, OnInit, Inject, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ApiService, Maps } from './api.service';
import * as turf from '@turf/turf';
import { geolib } from './geolib';
import { Waypoints } from '../classes/waypoints';
import { DataService } from './data.service';



const colors = [
  'red',
  'blue',
  'green',
  'yellow',
  'brown',
  'BurlyWood',
  'Cyan',
  'DarkGreen',
  'DarkOrchid',
  'DarkOliveGreen',
  'Fuchsia',
  'GoldenRod',
  'Indigo',
  'LightCoral',
  'MediumSlateBlue',
];
let colorIndex = 0;

const place = null as google.maps.places.PlaceResult;
type Components = typeof place.address_components;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  @ViewChild("search", { static: false })
  public searchElementRef: ElementRef;

  @ViewChild("map", { static: false })
  public mapElementRef: ElementRef;

  public entries = [];
  public place: google.maps.places.PlaceResult;

  public locationFields = ["name", "cityName", "stateCode", "countryName", "countryCode"];

  private map: google.maps.Map;
  public callback = null
  latitude: number;
  longitude: number;
  zoom: number;
  waypoints = new Array<Waypoints>();

  constructor(private apiService: ApiService, private ngZone: NgZone, private router: Router, private data: DataService) {

    this.data.currentwaypoints.subscribe(wp => this.waypoints = wp);

  }

  ngAfterViewInit(): void {
     
    this.apiService.api.then(maps => {
      this.initAutocomplete(maps);
      this.initMap(maps);
    });
  }

  next() {
    this.router.navigate(['landingpage']);
  }

  ngOnInit() {
  }


  initAutocomplete(maps: Maps) {
    let autocomplete = new maps.places.Autocomplete(this.searchElementRef.nativeElement);

    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        this.onPlaceChange(autocomplete.getPlace());
      });
    });
  }

  initMap(maps: Maps) {
    this.map = new maps.Map(this.mapElementRef.nativeElement, {
      zoom: 15
    });
    if (this.waypoints != null || this.waypoints.length > 0) {
      this.map = new maps.Map(this.mapElementRef.nativeElement, {
        zoom: 15
      });
      this.waypoints.forEach(element => {
        this.onPlaceChange(element.place)
      });
    }
    
    this.map.addListener('click', event => {

      const ellipsePoints = toEllipse(this.entries[0].location.bounds);
      var line = turf.helpers.lineString(ellipsePoints.map(p => [p.longitude, p.latitude]));

      const pointLatLng = event.latLng as google.maps.LatLng;
      var point = turf.helpers.point([pointLatLng.lng(), pointLatLng.lat()]);
      //point = turf.helpers.point([this.entries[0].location.coordinates.longitude, this.entries[0].location.coordinates.latitude]);
      const isInside = geolib.isPointInside({ latitude: pointLatLng.lat(), longitude: pointLatLng.lng() }, ellipsePoints);
      const distance = isInside ? 0 : turf.pointToLineDistance(point, line);
      console.log('distance', distance * 1000);
    });
  }

  onPlaceChange(place: google.maps.places.PlaceResult) {
    this.map.setCenter(place.geometry.location);
    this.waypoints.push(new Waypoints(place));
    this.newMessage(this.waypoints);
    const color = colors[(colorIndex++) % colors.length]
    const pin = this.pin(color);

    const marker = new google.maps.Marker({
      position: place.geometry.location,
      animation: google.maps.Animation.DROP,
      map: this.map,
      icon: this.pin(color),
    });

    this.entries.unshift({ place, marker, color, location });
  }



  pin(color) {
    return {
      path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#000',
      strokeWeight: 2,
      scale: 1,
    };
  }
 
  newMessage(wp: Array<Waypoints>) {
    this.data.changeMessage(wp)
  }
}


function toEllipse({ north, south, east, west }: cosmos.LatLngBoundsLiteral) {
  const latitude = (north + south) / 2;
  const longitude = (east + west) / 2;
  const r1 = geolib.getDistance({ latitude: north, longitude }, { latitude: south, longitude }) / 2;
  const r2 = geolib.getDistance({ latitude, longitude: west }, { latitude, longitude: east }) / 2;

  const center = { latitude, longitude };
  const latitudeConv = geolib.getDistance(center, { latitude: latitude + 0.1, longitude }) * 10;
  const longitudeCong = geolib.getDistance(center, { latitude, longitude: longitude + 0.1 }) * 10;

  const points: cosmos.Coordinates[] = [];
  const FULL = Math.PI * 2;
  for (let i = 0; i <= FULL + 0.0001; i += FULL / 8) {
    points.push({
      latitude: latitude + r1 * Math.cos(i) / latitudeConv,
      longitude: longitude + r2 * Math.sin(i) / longitudeCong,
    });
  }
  return points;
}
namespace cosmos {
  export interface Coordinates {
    /**
     * Coordinates latitude.
     * @type {number}
     */
    latitude: number;
    /**
     * Coordinates longitude.
     * @type {number}
     */
    longitude: number;
  }
  export interface LatLngBoundsLiteral {
    /**
     * LatLngBoundsLiteral east.
     * @type {number}
     */
    east: number;
    /**
     * LatLngBoundsLiteral north.
     * @type {number}
     */
    north: number;
    /**
     * LatLngBoundsLiteral south.
     * @type {number}
     */
    south: number;
    /**
     * LatLngBoundsLiteral west.
     * @type {number}
     */
    west: number;
  }
}