import { ObserverManagerService } from './../observer.manager.service';
import { DEAFULT_STATE_VALUE, ACTIONS_MAP } from './../constants';
import { Component } from '@angular/core';
import { ActionsManagerComponent } from './actions.manager.component';
import { BottomBarComponent } from '../components/bottombar.component';
import { Subject } from "rxjs";

export interface Categories {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'view-component',
  template: `
  <h2>{{state}}</h2>
  <mat-accordion *ngIf="state == 'locations'">
    <mat-grid-list cols="2" rowHeight="4:1">
      <mat-grid-tile>
        <mat-form-field>
          <mat-label>Choose a Category</mat-label>
          <mat-select (selectionChange)="updateSelection($event.value)">
            <mat-option *ngFor="let category of categoriesSelections" [value]="category.value">
              {{category.viewValue}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </mat-grid-tile>
      <mat-grid-tile>
        <button mat-raised-button color="accent" (click)="sort()">Sort alphabetical</button>
      </mat-grid-tile>
    </mat-grid-list>
  
    <mat-divider></mat-divider>
    <mat-expansion-panel *ngFor="let item of filterdLocationsItems">
      <mat-expansion-panel-header>
        <mat-panel-title>
          {{item.name}}
        </mat-panel-title>
      </mat-expansion-panel-header>
      <p><span class="inner-title">Address</span>: {{item.address}}</p>
      <p><span class="inner-title">Coordinates</span>: {{item.coordinates}}</p>
      <p><span class="inner-title">Categories</span>: {{item.category}}</p>
      <mat-divider></mat-divider>
      <button mat-raised-button color="accent" (click)="viewInMap(item)">View in map</button>
    </mat-expansion-panel>
    <p *ngIf="filterdLocationsItems.length == 0">
      No locations for this category
    </p>
  </mat-accordion>
  
  <div *ngIf="state == 'categories'">
    <mat-card *ngFor="let item of categories">{{item}}</mat-card>
  </div>
`,
  styles: [
  ]
})

export class ViewComponent {
  title = 'ViewComponent';
  state = DEAFULT_STATE_VALUE;
  items: any;
  categories: any;
  locations: any;
  filterdLocationsItems: any;
  categoriesSelections: Categories[] = [];
  data: any;

  constructor(
    private observerManagerService: ObserverManagerService,
    private subject: Subject<object>
  ) {
    this.data = this.observerManagerService.initData();
    this.updateElements(this.data);

    const actionManagerObservable = this.observerManagerService.getObserver();
    actionManagerObservable.subscribe(data => {
      this.updateElements(data);
    });
  }

  updateElements(data) {
    data.categories = data.categories || [];
    this.categoriesSelections = data.categories.map(value => {
      return { 'value': value, 'viewValue': value }
    })

    this.categoriesSelections.unshift({ 'value': 'all', 'viewValue': 'all' })
    this.categories = data.categories || [];
    this.locations = data.locations || [];
    this.filterdLocationsItems = data.locations || [];
    this.state = data.state;
  }

  sort() {
    this.filterdLocationsItems.sort((item1, item2) => {
      if (item1.name < item2.name) {
        return -1;
      }
      if (item1.name > item2.name) {
        return 1;
      }
      return 0;
    })
  }

  updateSelection(value) {
    if (value == 'all') {
      this.filterdLocationsItems = this.locations;
    }
    else {
      this.filterdLocationsItems = this.locations.filter(item => item.category == value)
    }
  }

  viewInMap(item) {
    this.data.action = ACTIONS_MAP;
    this.data.coordinates = item.coordinates;
    this.observerManagerService.updateData(this.data);
  }
}