import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {
  ErrorStateMatcher,
  MatButtonModule,
  MatCardModule, MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatListModule, MatSidenavModule, MatSortModule,
  MatTableModule,
  MatToolbarModule, ShowOnDirtyErrorStateMatcher
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
import { TeamComponent } from './pages/team/team.component';
import {TeamService} from './service/team/team-service';
import { NewTeamComponent } from './pages/team/new-team/new-team.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatchContextComponent } from './pages/match-context/match-context.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HomeComponent,
    MatchesComponent,
    LoginComponent,
    TeamComponent,
    NewTeamComponent,
    MatchContextComponent
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
    MatSortModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    NewTeamComponent
  ],
  providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    AuthorizationGuard,
    AuthService,
    TeamService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
