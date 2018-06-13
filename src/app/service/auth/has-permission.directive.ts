import {Directive, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from './auth.service';
import {User} from './user.dto';
import {Subscription} from 'rxjs';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private currentUser: User;
  private permissions = [];
  private userSubscription: Subscription;
  constructor(private element: ElementRef, private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef,
              private authService: AuthService) {
  }

  ngOnInit() {
    if (this.authService.user) {
      this.initByUser();
    } else {
      this.userSubscription = this.authService.getUserChangeObservable().subscribe(changed => {
        if (changed) {
          this.initByUser();
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  @Input()
  set appHasPermission(val) {
    this.permissions = val instanceof Array ? val : [val];
    this.updateView();
  }

  private initByUser() {
    this.currentUser = this.authService.user;
    this.updateView();
  }

  private updateView() {
    if (this.checkPermission()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private checkPermission(): boolean {
    if (this.currentUser && this.currentUser.roles) {
      console.log('Check permissions', this.permissions, this.currentUser.roles);
      for (const checkPermission of this.permissions) {
        const permissionFound = this.currentUser.roles.find(x => x.toUpperCase() === checkPermission.toUpperCase());
        if (permissionFound) {
          console.log('Permission found to user', this.permissions);
          return true;
        }
      }
    }
    return false;
  }
}
