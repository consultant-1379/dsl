import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';

@Injectable()
export class DslToastrService {
  static readonly SHORT = 5000;
  static readonly LONG = 10000;

  constructor(
    private toastrService: ToastrService,
  ) { }

  info(message: string, heading: string, milliseconds?: number) {
    const toastrOptions = this.getToastrOptions(milliseconds);
    this.toastrService.info(message, heading, toastrOptions);
  }

  success(message: string, heading: string, milliseconds?: number) {
    const toastrOptions = this.getToastrOptions(milliseconds);
    this.toastrService.success(message, heading, toastrOptions);
  }

  warning(message: string, heading: string, milliseconds?: number) {
    const toastrOptions = this.getToastrOptions(milliseconds);
    this.toastrService.warning(message, heading, toastrOptions);
  }

  error(message: string, heading: string, milliseconds?: number) {
    const toastrOptions = this.getToastrOptions(milliseconds);
    this.toastrService.error(message, heading, toastrOptions);
  }

  private getToastrOptions(milliseconds) {
    let timeOut = milliseconds;
    if (!timeOut) {
      timeOut = DslToastrService.SHORT;
    }
    return {
      timeOut,
      progressBar: true,
      positionClass: 'toast-top-center',
    };
  }
}
