import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {
  ErrorStateMatcher,
  MatButtonModule,
  MatCardModule, MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatListModule, MatSelectModule, MatSidenavModule, MatSnackBarModule, MatSortModule,
  MatTableModule, MatTabsModule,
  MatToolbarModule, MatTreeModule, ShowOnDirtyErrorStateMatcher
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
import {TeamComponent} from './pages/team/team.component';
import {TeamService} from './service/team/team-service';
import {NewTeamComponent} from './pages/team/new-team/new-team.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatchContextComponent} from './pages/match-context/match-context.component';
import {RootContextChoiceModalComponent} from './pages/admin-context/root-context-choice-modal/root-context-choice-modal.component';
import {ContextService} from './service/context/context.service';
import {TabTreeComponent} from './pages/match-context/tab-tree/tab-tree.component';
import {NewContextModalComponent} from './pages/admin-context/new-context-modal/new-context-modal.component';
import {NewRootContextModalComponent} from './pages/admin-context/new-root-context-modal/new-root-context-modal.component';
import {ContextTreeComponent} from './pages/admin-context/context-tree/context-tree.component';
import {AdminContextComponent} from './pages/admin-context/admin-context.component';
import {SpinnerComponent} from './components/spinner/spinner.component';
import {GlobalErrorHandler} from './components/global-error-handler';
import {SpinnerService} from './components/spinner/spinner.service';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    SpinnerComponent,
    HomeComponent,
    MatchesComponent,
    LoginComponent,
    TeamComponent,
    NewTeamComponent,
    MatchContextComponent,
    RootContextChoiceModalComponent,
    NewContextModalComponent,
    NewRootContextModalComponent,
    ContextTreeComponent,
    AdminContextComponent,
    TabTreeComponent
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
    MatSelectModule,
    MatTabsModule,
    MatTreeModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    NewTeamComponent,
    RootContextChoiceModalComponent,
    NewContextModalComponent,
    NewRootContextModalComponent
  ],
  providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    {provide: ErrorHandler, useClass: GlobalErrorHandler},
    AuthorizationGuard,
    SpinnerService,
    AuthService,
    TeamService,
    ContextService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
