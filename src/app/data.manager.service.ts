import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataManagerService {

  stateObserver: any;

  constructor() {}

  saveData(data) {
    localStorage.setItem('my_locations_data',  JSON.stringify(data));
  }

  loadData() {
    return JSON.parse(localStorage.getItem('my_locations_data') || '{}');
  }
}