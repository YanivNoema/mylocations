import { ObserverManagerService } from './../observer.manager.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'edit-component',
  template: `
  <h2>Edit {{state}}</h2>

  <div *ngIf="localState == 'select'">
    <mat-list role="list" *ngFor="let item of items">
    <mat-list-item [ngClass]="{'list-item-selected': selectedItem == item}" class="list-item" role="listitem" (click)="chooseItem(item)">{{item}}</mat-list-item>
  </mat-list>
    <mat-divider></mat-divider>
    <div>
      Selected item: {{selectedItem}}
      <pre *ngIf="state == 'categories'">*Please notice all locations who have this category will be updated too</pre>
    </div>
    <mat-divider></mat-divider>
    <button mat-raised-button color="accent" (click)="edit()">Edit selected</button>
  </div>
`,
})
export class EditComponent {

  data: any;
  categories: any;
  locations: any;
  state: string;
  items: any;
  selectedItem: string;
  localState = 'select';
  editItemIndex: number;

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
      this.locations = data.locations.map(item => item.name);
      this.items = this.state == 'locations' ? this.locations : this.categories;
  }

  chooseItem(item) {
    this.selectedItem = item;
  }

  getItem() {
    return this.selectedItem;
  }

  edit() {
    var index;
    if (this.state == 'locations') {
      index  = this.data.locations.findIndex(v=> v,name == this.selectedItem)
    }
    else if (this.state == 'categories') {
      index = this.data.categories.indexOf(this.selectedItem);
    }

    this.data.action = 'add';
    this.data.caller = 'edit-component';
    this.data.editIndex = index;
    this.observerManagerService.updateData(this.data);
  }
}
