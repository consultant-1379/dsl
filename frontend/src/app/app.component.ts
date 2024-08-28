import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import 'rxjs/add/operator/filter';

import { LivenessService } from './_services/liveness/liveness.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'app';
  showLivenessError = false;

  constructor(private livenessService: LivenessService,
              private router: Router) {}

  ngOnInit() {
    this.livenessService.performLivenessCheck().subscribe(
      () => {},
      (error) => {
        this.livenessService.scheduleLivenessCheck();
      },
    );
    this.router.events.filter(event => event instanceof NavigationStart)
      .subscribe(() => {
        this.livenessService.scheduleLivenessCheck();
      });
  }

  setShowLivenessError(showError: boolean) {
    this.showLivenessError = showError;
  }
}
