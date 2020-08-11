import { Component, OnInit, Inject, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService, Maps } from '../maps/api.service';

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
  latitude: number;
  longitude: number;


  constructor(private apiService: ApiService, private ngZone: NgZone, private router: Router) {

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
        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();

      });
    });
  }

  ngOnInit() {
  }



  public openexplorer(id) {
    var element: HTMLElement = document.getElementById(id) as HTMLElement;
    element.click();
    return;
  }


  next() {
    var navExtra: NavigationExtras = {};

    navExtra.state = {
      "Address": this.address.formatted_address,
      "Lat": this.latitude,
      "Long": this.longitude
    }
    this.router.navigate([''], navExtra);
  }

}
