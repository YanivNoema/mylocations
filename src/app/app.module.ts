import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Subject } from "rxjs";
import { AgmCoreModule } from '@agm/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { 
  MatCardModule, 
  MatMenuModule, 
  MatButtonModule, 
  MatIconModule, 
  MatStepperModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatExpansionModule,
  MatDividerModule,
  MatListModule,
  MatSelectModule,
  MatGridListModule
} from '@angular/material';
import { LocationComponent } from './location-component/location.component';
import { ActionsManagerComponent } from './actions-components/actions.manager.component';
import { TopBarComponent } from './components/topbar.component';
import { BottomBarComponent } from './components/bottombar.component';
import { MapComponent } from './components/map.component';
import { EditComponent } from './actions-components/edit-component';
import { ViewComponent } from './actions-components/view-component';
import { AddComponent } from './actions-components/add-component';
import { DataManagerService } from './data.manager.service';
import { RemoveComponent } from './actions-components/remove-component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';


export const environment = {
  firebase: {
    apiKey: "AIzaSyA1kiQXfBb39TYxx9f8Uq8gj80qdMc0kAs",
    projectId: "mylocations-7b0af",
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LocationComponent,
    ActionsManagerComponent,
    ViewComponent,
    AddComponent,
    TopBarComponent,
    BottomBarComponent,
    MapComponent,
    RemoveComponent,
    EditComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBsaA49OorCp7F7d9TycPoyneF58Li3CLo'
    }),
    AngularFireModule.initializeApp(environment.firebase),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatMenuModule, 
    MatButtonModule, 
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatStepperModule,
    MatInputModule,
    MatExpansionModule,
    MatDividerModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatGridListModule
  ],
  providers: [
    ViewComponent,
    ActionsManagerComponent,
    MapComponent,
    TopBarComponent,
    RemoveComponent,
    Subject,
    BottomBarComponent,
    DataManagerService,
    EditComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
