import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatListModule, MatSidenavModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {RouterModule} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {MatchesComponent} from './pages/matches/matches.component';
import {environment} from '../environments/environment';
import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {LoginComponent} from './pages/login/login.component';
import {AuthService} from './service/auth/auth.service';
import {appRoutes} from './app.routing';
import {AuthorizationGuard} from './pages/login/authorization-guard';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HomeComponent,
    MatchesComponent,
    LoginComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      // {enableTracing: true} // <-- debugging purposes only
    ),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSidenavModule,
    MatListModule
  ],
  providers: [
    AuthorizationGuard,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
