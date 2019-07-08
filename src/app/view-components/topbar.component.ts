import { ObserverManagerService } from './../observer.manager.service';
import { Component } from '@angular/core';
import { Subject } from "rxjs";

@Component({
  selector: 'top-bar-component',
  template: `
  <mat-toolbar color="primary" class="row">
  <img src="..//..//assets//my-location-logo.png" height="30"/>
  <button mat-button [matMenuTriggerFor]="menu">Actions</button>
  <mat-menu #menu="matMenu">
    <button (click)="updateAction('view')" mat-button>View</button>
    <button (click)="updateAction('add')" mat-button>Add</button>
    <button (click)="updateAction('remove')" mat-button>Remove</button>
    <button (click)="updateAction('edit')" mat-button>Edit</button>
  </mat-menu>
</mat-toolbar>
`,
  styles: [
    'img {margin-right: 35px}'
  ]
})
export class TopBarComponent {
  constructor(private observerManagerService: ObserverManagerService) { }
  updateAction(action) {
    this.observerManagerService.updateAction(action);
  }
}
