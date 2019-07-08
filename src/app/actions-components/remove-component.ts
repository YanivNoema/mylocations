import { ObserverManagerService } from './../observer.manager.service';
import { Component } from '@angular/core';
import { STATE_LOCATIONS, STATE_CATEGORIES } from '../constants';

export interface Categories {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'remove-component',
  template: `
  <h2>Remove {{state}}</h2>
  <mat-list role="list" *ngFor="let item of items">
    <mat-list-item [ngClass]="{'list-item-selected': selectedItem == item}" class="list-item" role="listitem" (click)="chooseItem(item)">{{item}}</mat-list-item>
  </mat-list>
  <mat-divider></mat-divider>
  <div>
    Selected item: {{selectedItem}}
    <pre *ngIf="state == 'categories'">*Please notice all locations who have this category will be deleted too</pre>
  </div>
  <mat-divider></mat-divider>
  <button mat-raised-button color="warn" (click)="delete()">Delete selected</button>
`,
})
export class RemoveComponent {

  data: any;
  categories: any;
  locations: any;
  state: string;
  items: any;
  selectedItem: string;

  constructor(private observerManagerService: ObserverManagerService) {
    this.data = this.observerManagerService.initData();
    this.updateElements(this.data);

    const actionManagerObservable = this.observerManagerService.getObserver();
    actionManagerObservable.subscribe(data => {
      this.updateElements(data);
    });
  }

  updateElements(data) {
    this.data = data;
    this.state = data.state;
    this.categories = data.categories;
    data.locations = data.locations || [];
    this.locations = data.locations.map(item => item.name);
    this.items = this.state == STATE_LOCATIONS ? this.locations : this.categories;
  }

  chooseItem(item) {
    this.selectedItem = item;
  }

  getItem() {
    return this.selectedItem;
  }

  delete() {
    if (this.state == STATE_LOCATIONS) {
      const index = this.data.locations.findIndex(v => v, name == this.selectedItem)
      if (index > -1) {
        this.data.locations.splice(index, 1);
      }
    }
    else if (this.state == STATE_CATEGORIES) {
      const index = this.data.categories.indexOf(this.selectedItem);
      if (index > -1) {
        this.data.categories.splice(index, 1);
      }

      this.data.locations = this.data.locations.filter(item => {
        return item.category != this.selectedItem;
    });

    }

    this.observerManagerService.updateData(this.data);
  }
}
