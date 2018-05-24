import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {SpinnerService} from './spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  visible: boolean;

  constructor(private spinnerService: SpinnerService, public zone: NgZone) {
  }

  ngOnInit() {
    this.subscription = this.spinnerService.getShowHideSubscription().subscribe(show => {
      this.visible = show;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
