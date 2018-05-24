import {ErrorHandler, Injectable} from '@angular/core';
import {SpinnerService} from './spinner/spinner.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private spinnerService: SpinnerService) {
  }

  handleError(error: any): void {
    console.error('ERROR FOUND', error);
    this.spinnerService.hide();
  }
}
