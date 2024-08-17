import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { LogoscreenComponent } from './logoscreen/logoscreen.component';
import { appRoutes } from './app.routes';
import { AppComponent } from './app.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    MatDialogModule,
    BrowserAnimationsModule,
    AppComponent,
  ],
  declarations: [],
  bootstrap: [],
})
export class AppModule {}
