import { ObserverManagerService } from './../observer.manager.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'actions-manager-component',
  template: `
  <div class='row'>
      <div class='column'>
          <view-component></view-component>
      </div>
      <div class='column'>
        <add-component *ngIf="action == 'add'"></add-component>
        <map-component *ngIf="action == 'map'"></map-component>
        <remove-component *ngIf="action == 'remove'"></remove-component>
        <edit-component *ngIf="action == 'edit'"></edit-component>
      </div>
  </div>
`,
  styles: [
  ]
})
export class ActionsManagerComponent implements OnInit {
  title = 'ActionsManagerComponent';
  action: string;
  data: any;

  constructor(private observerManagerService: ObserverManagerService) {}

  ngOnInit() {
    this.data = this.observerManagerService.initData();
    this.action = this.data.action;

    const actionManagerObservable = this.observerManagerService.getObserver();
    actionManagerObservable.subscribe(data => {
      this.action = this.data.action;
    });
  }
}