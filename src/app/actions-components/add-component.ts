import { ObserverManagerService } from './../observer.manager.service';
import { DEAFULT_STATE_VALUE, STATE_LOCATIONS, STATE_CATEGORIES } from './../constants';
import { Categories } from '../usefull';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subject } from "rxjs";

@Component({
  selector: 'add-component',
  template: `
  <h2>Add {{state}}</h2>

  <form autocomplete="off" [formGroup]="locationsForm" (ngSubmit)="onSubmit('locations')" *ngIf="state == 'locations'">

  <div *ngIf="isCategoriesEmpty" style="color: red;">
    Please add categories first
  </div>

    <mat-grid-list cols="2" rowHeight="3:1">
      <mat-grid-tile>
        <mat-form-field class="full-width">
          <mat-label>Name</mat-label>
          <input matInput type="text" formControlName="name" name="name">
          <div *ngIf="locationsForm.controls['name'].errors && !locationsForm.controls['name'].pristine" class="error-msg">
            <div [hidden]="!locationsForm.controls['name'].errors.required">Name is required</div>
          </div>
        </mat-form-field>
      </mat-grid-tile>
  
      <mat-grid-tile>
        <mat-form-field class="full-width">
          <mat-label>Address</mat-label>
          <input matInput type="text" formControlName="address" name="address">
          <div *ngIf="locationsForm.controls['address'].errors && !locationsForm.controls['address'].pristine" class="error-msg">
            <div [hidden]="!locationsForm.controls['address'].errors.required">Address is required</div>
          </div>
        </mat-form-field>
      </mat-grid-tile>
  
      <mat-grid-tile>
        <mat-form-field class="full-width">
          <mat-label>Longitude</mat-label>
          <input matInput type="text" formControlName="longitude" name="longitude">
          <div *ngIf="locationsForm.controls['longitude'].errors && !locationsForm.controls['longitude'].pristine" class="error-msg">
            <div [hidden]="!locationsForm.controls['longitude'].errors.required">Longitude is required</div>
            <div [hidden]="!locationsForm.controls['longitude'].errors.pattern">Use coordinate format XX.xx</div>
          </div>
        </mat-form-field>
      </mat-grid-tile>
  
      <mat-grid-tile>
        <mat-form-field class="full-width">
          <mat-label>Latitude</mat-label>
          <input matInput type="text" formControlName="latitude" name="latitude">
          <div *ngIf="locationsForm.controls['latitude'].errors && !locationsForm.controls['latitude'].pristine" class="error-msg">
            <div [hidden]="!locationsForm.controls['latitude'].errors.required">Latitude is required</div>
            <div [hidden]="!locationsForm.controls['latitude'].errors.pattern">Use coordinate format XX.xx</div>
          </div>
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
      <div *ngIf="locationsForm.controls['category'].errors && !locationsForm.controls['category'].pristine" class="error-msg">
        <div [hidden]="!locationsForm.controls['category'].errors.required">Category is required</div>
      </div>
    </mat-form-field>
  
    <button mat-stroked-button type="submit" [disabled]="!locationsForm.valid" style="width: 100px">Submit</button>
  
  </form>
  
  <form autocomplete="off" [formGroup]="categoriesForm" (ngSubmit)="onSubmit('categories')" *ngIf="state == 'categories'">
    <mat-form-field class="full-width">
      <mat-label>Name</mat-label>
      <input matInput type="text" formControlName="name" name="name">
      <div *ngIf="categoriesForm.controls['name'].errors && !categoriesForm.controls['name'].pristine" class="error-msg">
        <div [hidden]="!categoriesForm.controls['name'].errors.required">Name is required</div>
        <div [hidden]="!categoriesForm.controls['name'].errors.checkIfContainsValidator">Name is already exists</div>
      </div>
    </mat-form-field>
  
    <button mat-stroked-button type="submit" [disabled]="!categoriesForm.valid" style="width: 100px; margin-top: 15px;">Submit</button>
  
  </form>
`
})
export class AddComponent implements OnInit {
  title = 'Add';
  state = DEAFULT_STATE_VALUE;
  selected: string;
  data: any;
  isCategoriesEmpty: boolean;
  categoriesSelections: Categories[] = [];

  private checkIfContainsValidator = (control: AbstractControl) => {
    return this.checkIfContains(control.value, this && this.data ? this.data.categories : []);
  };

  checkIfContains(value, items) {
    if (items.indexOf(value) > -1) {
      return {'checkIfContainsValidator': true};
    }
    return null;
  }

  locationsForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    address: new FormControl('', [
      Validators.required
    ]),
    longitude: new FormControl('', [
      Validators.required,
      Validators.pattern("[0-9]+(\.[0-9][0-9]?)?"),
    ]),
    latitude: new FormControl('', [
      Validators.required,
      Validators.pattern("[0-9]+(\.[0-9][0-9]?)?"),
    ]),
    category: new FormControl('', [
      Validators.required
    ]),
  });

  categoriesForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      this.checkIfContainsValidator
    ])
  });

  constructor(
    private subject: Subject<object>,
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
    this.isCategoriesEmpty = data.length == 0;

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
    if (this.state == STATE_LOCATIONS) {
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

    if (type == STATE_LOCATIONS) {
      if (this.data.caller == 'edit-component') {
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
    else if (type == STATE_CATEGORIES) {
      if (this.data.caller == 'edit-component') {
        for (var i = 0; i < this.data.locations.length; i++) {
          
          // We update locations category
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