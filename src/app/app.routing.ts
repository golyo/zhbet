import {LoginComponent} from './pages/login/login.component';
import {MatchesComponent} from './pages/matches/matches.component';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {AuthorizationGuard} from './pages/login/authorization-guard';
import {TeamComponent} from './pages/team/team.component';
import {MatchContextComponent} from './pages/match-context/match-context.component';
import {AdminContextComponent} from './pages/admin-context/admin-context.component';
import {BetContextComponent} from './pages/bet-context/bet-context.component';
import {TeamBetComponent} from './pages/team/team-bet/team-bet.component';
import {UserRiportComponent} from './pages/user-riport/user-riport.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }, {
    path: 'login',
    component: LoginComponent
  }, {
    path: 'admin',
    component: AdminContextComponent,
    canActivate: [AuthorizationGuard],
    data: {
      roles: ['ADMIN']
    }
  }, {
    path: 'teamAdmin',
    component: TeamComponent,
    canActivate: [AuthorizationGuard],
    data: {
      checkContext: true,
      roles: ['ADMIN']
    }
  }, {
    path: 'team',
    component: TeamBetComponent,
    canActivate: [AuthorizationGuard],
    data: {
      checkContext: true
    }
  }, {
    path: 'context',
    component: MatchContextComponent,
    canActivate: [AuthorizationGuard]
  }, {
    path: 'bets',
    component: BetContextComponent,
    canActivate: [AuthorizationGuard]
  }, {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthorizationGuard],
  }, {
    path: 'matches',
    component: MatchesComponent,
    canActivate: [AuthorizationGuard],
    data: {
      checkContext: true
    }
  }, {
    path: 'riport',
    component: UserRiportComponent,
    canActivate: [AuthorizationGuard],
    data: {
      checkContext: true
    }
  }, {
    path: '**',
    component: PageNotFoundComponent
  }
];
