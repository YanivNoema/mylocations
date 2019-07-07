import { DataManagerService } from './data.manager.service';
import { Subject } from 'rxjs';
import { DEAFULT_APP_STATE } from './constants';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ObserverManagerService {
  data: any;
  constructor(
    private subject: Subject<object>,
    private dataManagerService: DataManagerService) {
    this.data = DEAFULT_APP_STATE;
    var { locations, categories } = this.dataManagerService.loadData();
    this.data.locations = locations;
    this.data.categories = categories;
    this.updateSubsribers();
  }

  updateState(state) {
    this.data.state = state;
    this.updateSubsribers();
  }

  updateAction(action) {
    this.data.action = action;
    this.updateSubsribers();
  }

  initData() {
    return this.data;
  }

  updateSubsribers() {
    this.subject.next(this.data);
  }

  getObserver(): any {
    return this.subject.asObservable();
  }

  updateData(data) {
    this.dataManagerService.saveData({locations: data.locations, categories: data.categories});
    this.data = data;
    this.subject.next(this.data);
  }
}