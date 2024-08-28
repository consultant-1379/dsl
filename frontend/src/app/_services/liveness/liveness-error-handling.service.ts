import { Injectable, EventEmitter } from '@angular/core';

import { LivenessService } from './liveness.service';
import { COUCHDB, GITLAB, BACKEND } from './dependencies';
import { DslToastrService } from '../dsl-toastr.service';

/*
 * Helps the DependsOn decorator to detect and display errors when backend
 *  services are down
 */
@Injectable()
export class LivenessErrorHandlingService {

  showError = new EventEmitter<boolean>();
  listenForLivenessError = false;

  constructor(
    private livenessService: LivenessService,
    private dslToastrService: DslToastrService,
  ) {
    this.livenessService.overallStatus.subscribe((everythingIsLive) => {
      if (everythingIsLive) {
        this.showError.emit(false);
      }
      if (!everythingIsLive && this.listenForLivenessError) {
        this.showError.emit(true);
      }
      this.listenForLivenessError = false;
    });
  }

  checkStatus(dependency: string): boolean {
    switch (dependency) {
      case COUCHDB:
        return this.livenessService.couchDbIsLive;
      case GITLAB:
        return this.livenessService.gitlabIsLive;
      case BACKEND:
        return this.livenessService.backendIsLive;
      default:
        throw new Error(`The dependency ${dependency} is not recognised`);
    }
  }

  showToastr(message: string) {
    this.dslToastrService.error(message, 'Error');
  }

  showErrorPane() {
    this.showError.emit(true);
  }

  checkForLivenessError() {
    this.listenForLivenessError = true;
    this.livenessService.scheduleLivenessCheck();
  }

}
