import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../../service/auth/auth.service';
import {Observable} from 'rxjs';

/**
 * This guard prevents loading pages depending on authorization of the user.
 */
@Injectable()
export class AuthorizationGuard implements CanActivate {

  /**
   * The permissions the user has received upon logging in.
   */
  roles: Array<string>;

  /**
   * @param {SecurityContextHolder} securityContextHolder
   * @param {Router} router
   * @param {LoggerService} loggerService
   */
  constructor(private authService: AuthService, protected router: Router) {
  }

  /**
   * Checks whether the component can be loaded.
   * @param {ActivatedRouteSnapshot} route The snapshot of the current route in the Angular app.
   * @param {RouterStateSnapshot} state The state of the current route in the Angular app.
   * @returns {Observable<boolean> | Promise<boolean> | boolean} True, if the component can be loaded.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.roles = route.data['roles'] as Array<string> || null;
    return this.isActivable(route, state);
  }

  /**
   * Checks whether the user is logged in and has the required permissions to view the given page.
   * @param {RouterStateSnapshot} state The state of the current route in the Angular app.
   * @returns {boolean} True, if the given route is reachable by the current user.
   */
  protected isActivable(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.user) {
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}}).then(() => false);
      return false;
    } else if (this.roles && !this.isAuthorized()) {
      this.router.navigateByUrl('/403').then(() => false);
      return false;
    } else {
      return true;
    }
  }

  /**
   * Checks whether the currently logged used has the required permissions to view the page.
   * @returns {boolean} True, if the currently logged in user has the permissions to view the page.
   */
  private isAuthorized(): boolean {
    const uRoles = this.authService.user.roles;
    return uRoles && this.roles.some(role => uRoles.indexOf(role.trim()) > -1);
  }

}
