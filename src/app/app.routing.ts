import {LoginComponent} from './pages/login/login.component';
import {MatchesComponent} from './pages/matches/matches.component';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {AuthorizationGuard} from './pages/login/authorization-guard';
import {TeamComponent} from './pages/team/team.component';
import {MatchContextComponent} from './pages/match-context/match-context.component';
import {AdminContextComponent} from './pages/match-context/admin-context/admin-context.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }, {
    path: 'login',
    component: LoginComponent
  }, {
    path: 'team',
    component: TeamComponent,
    canActivate: [AuthorizationGuard],
    data: {
      checkContext: true
    }
  }, {
    path: 'context',
    component: MatchContextComponent,
    canActivate: [AuthorizationGuard],
  }, {
    path: 'admin',
    component: AdminContextComponent,
    canActivate: [AuthorizationGuard],
  }, {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthorizationGuard],
  }, {
    path: 'matches',
    component: MatchesComponent,
    canActivate: [AuthorizationGuard],
  }, {
    path: '**',
    component: PageNotFoundComponent
  }
];
