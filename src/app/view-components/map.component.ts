import { ObserverManagerService } from './../observer.manager.service';
import { Component } from '@angular/core';

@Component({
  selector: 'map-component',
  template: `
  <agm-map [latitude]="lat" [longitude]="lng">
    <agm-marker [latitude]="lat" [longitude]="lng"></agm-marker>
  </agm-map>
`,
})
export class MapComponent {
  lat: number;
  lng: number;
  data: any;

  constructor(private observerManagerService: ObserverManagerService ) {
    this.data = this.observerManagerService.initData();
    this.updateElements(this.data);

    const actionManagerObservable = this.observerManagerService.getObserver();
    actionManagerObservable.subscribe(data => {
      this.updateElements(data);
    });
  }

  updateElements(data) {
    this.data = data;
    const coor = this.data.coordinates.split(" ");
    this.lat = parseFloat(coor[0]);
    this.lng = parseFloat(coor[1]);
  }
}