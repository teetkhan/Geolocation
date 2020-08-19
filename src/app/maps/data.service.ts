import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Waypoints } from '../classes/waypoints';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  defaultwaypoins = new Array<Waypoints>();
  private waypoints = new BehaviorSubject(this.defaultwaypoins);
  currentwaypoints = this.waypoints.asObservable();

  constructor() { }

  changeMessage(waypoints: Array<Waypoints>) {
    this.waypoints.next(waypoints)
  }
}
