/* ============================================================================
 * Ericsson Data Science Lounge Frontend
 *
 * liveness-error.component.ts - displays an error message if one of our backend
 *  services is down (CouchDB, Gitlab etc.)
 * ============================================================================
 */
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { LivenessErrorHandlingService } from '../../_services/liveness/liveness-error-handling.service';
import { LivenessService } from '../../_services/liveness/liveness.service';

@Component({
  selector: 'app-liveness-error',
  templateUrl: './liveness-error.component.html',
  styleUrls: ['./liveness-error.component.scss'],
})
export class LivenessErrorComponent implements OnInit {

  @Output() displayLivenessErrorComponent = new EventEmitter<boolean>();
  showError = true;

  constructor(
    private livenessErrorHandlingService: LivenessErrorHandlingService,
  ) { }

  ngOnInit() {
    // show the error if livenessErrorHandlingService instructs us to do so
    this.livenessErrorHandlingService.showError.subscribe((showError) => {
      if (showError) {
        this.showError = true;
        this.displayLivenessErrorComponent.emit(true);
      } else {
        this.showError = false;
        setTimeout(() => {
          if (!this.showError) {
            this.displayLivenessErrorComponent.emit(false);
          }
        },         4000);
      }
    });

  }

}
