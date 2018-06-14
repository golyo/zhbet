import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../../service/auth/auth.service';
import {Observable} from 'rxjs';
import {ContextService} from '../../service/context/context.service';

/**
 * This guard prevents loading pages depending on authorization of the user.
 */
@Injectable()
export class AuthorizationGuard implements CanActivate {
  /**
   * @param {SecurityContextHolder} securityContextHolder
   * @param {Router} router
   * @param {LoggerService} loggerService
   */
  constructor(private authService: AuthService, private contextService: ContextService, protected router: Router) {
  }

  /**
   * Checks whether the component can be loaded.
   * @param {ActivatedRouteSnapshot} route The snapshot of the current route in the Angular app.
   * @param {RouterStateSnapshot} state The state of the current route in the Angular app.
   * @returns {Observable<boolean> | Promise<boolean> | boolean} True, if the component can be loaded.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.isActivable(route, state, route.data.roles, route.data.checkContext);
  }

  /**
   * Checks whether the user is logged in and has the required permissions to view the given page.
   * @param {RouterStateSnapshot} state The state of the current route in the Angular app.
   * @returns {boolean} True, if the given route is reachable by the current user.
   */
  protected isActivable(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, roles: Array<string>, checkContext: boolean): boolean {
    if (!this.authService.user || !this.authService.user.id) {
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}}).then(() => false);
      return false;
    } else if (roles && !this.isAuthorized(roles)) {
      this.router.navigateByUrl('/403').then(() => false);
      return false;
    } else if (checkContext && !this.contextService.selectedRoot) {
      this.router.navigateByUrl('/context').then(() => false);
      return false;
    } else {
      return true;
    }
  }

  /**
   * Checks whether the currently logged used has the required permissions to view the page.
   * @returns {boolean} True, if the currently logged in user has the permissions to view the page.
   */
  private isAuthorized(roles: Array<string>): boolean {
    const uRoles = this.authService.user.roles;
    return uRoles && roles.some(role => uRoles.indexOf(role.trim()) > -1);
  }

}
