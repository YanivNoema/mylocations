import { ObserverManagerService } from './../observer.manager.service';
import { DEAFULT_STATE_VALUE } from './../constants';
import { EditComponent } from './edit-component';
import { DataManagerService } from '../data.manager.service';
import { Categories } from '../usefull';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionsManagerComponent } from './actions.manager.component';
import { BottomBarComponent } from '../components/bottombar.component';
import { Subject } from "rxjs";

@Component({
  selector: 'add-component',
  template: `
  <h2>Add {{state}}</h2>

  <form autocomplete="off" [formGroup]="locationsForm" (ngSubmit)="onSubmit('locations')" *ngIf="state == 'locations'">
    <mat-grid-list cols="2" rowHeight="4:1">
  
      <mat-grid-tile>
        <mat-form-field class="full-width">
          <mat-label>Name</mat-label>
          <input matInput type="text" formControlName="name" name="name">
        </mat-form-field>
      </mat-grid-tile>
  
      <mat-grid-tile>
        <mat-form-field class="full-width">
          <mat-label>Address</mat-label>
          <input matInput type="text" formControlName="address" name="address">
        </mat-form-field>
      </mat-grid-tile>
  
      <mat-grid-tile>
        <mat-form-field class="full-width">
          <mat-label>Longitude</mat-label>
          <input matInput type="text" formControlName="longitude" name="longitude">
        </mat-form-field>
      </mat-grid-tile>
  
      <mat-grid-tile>
        <mat-form-field class="full-width">
          <mat-label>Latitude</mat-label>
          <input matInput type="text" formControlName="latitude" name="latitude">
        </mat-form-field>
      </mat-grid-tile>
  
    </mat-grid-list>
  
    <mat-form-field class="full-width">
      <mat-label>Choose a Category</mat-label>
      <mat-select [(ngModel)]="selected" formControlName="category" name="category">
        <mat-option *ngFor="let category of categoriesSelections" [value]="category.value">
          {{category.viewValue}}
        </mat-option>
      </mat-select>
    </mat-form-field>
  
    <button mat-stroked-button type="submit" [disabled]="!locationsForm.valid" style="width: 100px">Submit</button>
  
  </form>
  
  <form autocomplete="off" [formGroup]="categoriesForm" (ngSubmit)="onSubmit('categories')" *ngIf="state == 'categories'">
    <mat-form-field class="full-width">
      <mat-label>Name</mat-label>
      <input matInput type="text" formControlName="name" name="name">
    </mat-form-field>
  
    <button mat-stroked-button type="submit" [disabled]="!categoriesForm.valid" style="width: 100px">Submit</button>
  
  </form>
`
})
export class AddComponent implements OnInit {
  title = 'Add';
  state = DEAFULT_STATE_VALUE;
  selected: string;
  data: any;
  categoriesSelections: Categories[] = [];

  locationsForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),
    longitude: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),
    latitude: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),
    category: new FormControl('', [
      Validators.required
    ]),
  });

  categoriesForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ])
  });

  constructor(
    private subject: Subject<object>,
    private dataManagerService: DataManagerService,
    private observerManagerService: ObserverManagerService
    ) {}

    ngOnInit() {

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
      this.setCategories(data.categories);

      if (this.data.caller == 'edit-component') {
        this.startEditMode(this.data.editIndex);
      }
    }

    setCategories(categoriesData) {
      this.categoriesSelections = categoriesData.map(value => {
        return { 'value': value, 'viewValue': value }
      })
    }

    startEditMode(index) {
      if (this.state == 'locations') {
        var item = this.data.locations[index];
        const values = item.coordinates.split(' ');
        this.locationsForm.setValue({
          name: item.name,
          category: item.category,
          address: item.address,
          longitude: values[0],
          latitude: values[1]
        });
        this.selected = item.category;
      }
      else if (this.state == 'categories') {
        var item = this.data.categories[index];
        this.categoriesForm.setValue({
          name: item,
        });
      }
    }
  
  onSubmit(type) {  
    this.data.locations = this.data.locations ? this.data.locations : [];
    this.data.categories = this.data.categories ? this.data.categories : [];

    if (type == 'locations') {
      if (this.data.caller == 'edit-component')
      {
        this.data.locations[this.data.editIndex] = 
        {
          'name': this.locationsForm.value.name,
          'address': this.locationsForm.value.address,
          'category': this.locationsForm.value.category,
          'coordinates': `${this.locationsForm.value.latitude} ${this.locationsForm.value.longitude}`,
        }  
      }
      else {
        this.data.locations.push(
          {
            'name': this.locationsForm.value.name,
            'address': this.locationsForm.value.address,
            'category': this.locationsForm.value.category,
            'coordinates': `${this.locationsForm.value.latitude} ${this.locationsForm.value.longitude}`,
          },
        )
      }
      this.locationsForm.reset();
    }
    else if (type == 'categories') {
      if (this.data.caller == 'edit-component') {
        for (var i = 0; i < this.data.locations.length; i++) {
          if (this.data.locations[i].category == this.data.categories[this.data.editIndex]) {
            this.data.locations[i].category = this.categoriesForm.value.name;
          }  
        }
      this.data.categories[this.data.editIndex] = this.categoriesForm.value.name;

      }
      else {
        this.data.categories.push(this.categoriesForm.value.name);
        this.categoriesForm.reset();
      }
      this.categoriesForm.reset();
    }

    this.data.action = 'view';
    this.data.caller = '';
    this.data.editIndex = -1;
    this.observerManagerService.updateData(this.data);
  }

  public getDataObserver(): any {
    return this.subject;
  }
}