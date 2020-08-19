import { Component, OnInit, Inject, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router, NavigationExtras, Navigation, Data } from '@angular/router';
import { ApiService, Maps } from '../maps/api.service';
import { Waypoints } from '../classes/waypoints';
import { DataService } from '../maps/data.service';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {
  @ViewChild("address", { static: false })
  public AddressElementRef: ElementRef;
  private map: google.maps.Map;
  public address;
  waypoints = new Array<Waypoints>();

  constructor(private apiService: ApiService, private ngZone: NgZone, private router: Router, private data: DataService) {
    this.data.currentwaypoints.subscribe(wp => this.waypoints = wp);
  }

  ngAfterViewInit(): void {
    this.apiService.api.then(maps => {
      this.initAutocomplete(maps);
    });
  }

  initAutocomplete(maps: Maps) {
    let autocomplete = new maps.places.Autocomplete(this.AddressElementRef.nativeElement);
    autocomplete.addListener("place_changed", () => {
      this.address = autocomplete.getPlace();
      this.ngZone.run(() => {
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();
        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }
        //set latitude, longitude and zoom
        this.waypoints.push(new Waypoints(place));
        this.newMessage(this.waypoints);

      });
    });
  }

  ngOnInit() {
  }
  newMessage(wp: Array<Waypoints>) {
    this.data.changeMessage(wp)
  }



  public openexplorer(id) {
    var element: HTMLElement = document.getElementById(id) as HTMLElement;
    element.click();
    return;
  }


  next() {  
    this.router.navigate(['']);
  }

}