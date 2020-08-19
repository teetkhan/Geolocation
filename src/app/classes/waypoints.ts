export class Waypoints { public constructor(
    private _place : google.maps.places.PlaceResult = null   )
    {
    }
  
    set place(_val : google.maps.places.PlaceResult) {this._place = _val;}
    get place() : google.maps.places.PlaceResult {return this._place;}
    
   
}


