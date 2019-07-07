import { ObserverManagerService } from './../observer.manager.service';
import { Component } from '@angular/core';
import { Subject } from "rxjs";

@Component({
  selector: 'bottom-bar-component',
  template: `
  <mat-toolbar color="primary">
  <a (click)="updateState('locations')" mat-button>Locations</a>
  <a (click)="updateState('categories')" mat-button>Categories</a>
</mat-toolbar>
`,
})
export class BottomBarComponent {
  constructor(private observerManagerService: ObserverManagerService) { }

  updateState(state) {
    this.observerManagerService.updateState(state);
  }
}