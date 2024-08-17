import { Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { LogoscreenComponent } from './logoscreen/logoscreen.component';
import { SignupnextComponent } from './signupnext/signupnext.component';
export const appRoutes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'Signupnext', component: SignupnextComponent },
  { path: 'logoscreen', component: LogoscreenComponent },
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: '**', redirectTo: '/signin', pathMatch: 'full' },
];
