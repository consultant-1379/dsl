/* ============================================================================
 * Ericsson Data Science Lounge Frontend
 *
 * liveness.service.ts - Checks our backend services to make sure they are live,
 *    notifies subscribers if a service goes down
 * ============================================================================
 */
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from '../config.service';
import { Observable, forkJoin } from 'rxjs';

@Injectable()
export class LivenessService {
  couchDbIsLive = true;
  gitlabIsLive = true;
  backendIsLive = true;
  everythingIsLive = true;

  couchDbStatus = new EventEmitter();
  gitlabStatus = new EventEmitter();
  backendStatus = new EventEmitter();
  overallStatus = new EventEmitter();

  gitlabBaseUrl: string;
  couchDbBaseUrl: string;
  backendBaseUrl: string;

  readonly MIN_TIME_FOR_NEXT_CHECK = 5000;
  readonly MAX_TIME_FOR_NEXT_CHECK = 80000;
  milliSecUntilNextCheck = this.MIN_TIME_FOR_NEXT_CHECK;
  checkIsScheduled = false;

  constructor(private http: HttpClient,
              private configService: ConfigService) {
    this.gitlabBaseUrl = configService.get('BASE_URL_GITLAB');
    this.couchDbBaseUrl = configService.getDatabaseApi('COUCHDB_BASE_URL');
    this.backendBaseUrl = configService.getDSLBackendDetails('URL');
  }

  /*
   * Schedules a liveness check to be performed if one is not already scheduled
   */
  scheduleLivenessCheck() {
    if (!this.checkIsScheduled) {
      this.checkIsScheduled = true;
      setTimeout(() => {
        this.performLivenessCheck().subscribe(
          (next) => {},
          (error) => {
            // a service is down
            if (this.milliSecUntilNextCheck < this.MAX_TIME_FOR_NEXT_CHECK) {
              this.milliSecUntilNextCheck *= 2;
            }
            this.checkIsScheduled = false;
            this.scheduleLivenessCheck();
          },
          () => {
            // all services are live
            this.milliSecUntilNextCheck = this.MIN_TIME_FOR_NEXT_CHECK;
            this.checkIsScheduled = false;
          },
        );
      },         this.milliSecUntilNextCheck);
    }
  }

  performLivenessCheck() {
    console.log('LivenessService: Performing liveness check');
    return Observable.create((observer) => {
      forkJoin(
        this.checkCouchDb(),
        this.checkGitlab(),
        this.checkBackend(),
      ).subscribe(
        () => { },
        (error) => {
          this.overallStatus.emit(this.everythingIsLive);
          observer.error();
        },
        () => {
          this.everythingIsLive = true;
          this.overallStatus.emit(this.everythingIsLive);
          observer.complete();
        },
      );
    });
  }

  checkCouchDb() {
    return Observable.create((observer) => {
      this.http.get(this.couchDbBaseUrl).subscribe(
        (response) => {
          this.couchDbIsLive = true;
          this.couchDbStatus.emit(this.couchDbIsLive);
          observer.next(this.couchDbIsLive);
          observer.complete();
        },
        (error) => {
          this.everythingIsLive = false;
          this.couchDbIsLive = false;
          this.couchDbStatus.emit(this.couchDbIsLive);
          console.error('LivenessService: CouchDb is down');
          observer.error('CouchDb is down');
        },
      );
    });
  }

  checkGitlab() {
    return Observable.create((observer) => {
      const token = this.configService.get('GITLAB_PRIVATE_TOKEN');
      this.http.get(`${this.gitlabBaseUrl}/version/${token}`).subscribe(
        (response) => {
          this.gitlabIsLive = true;
          this.gitlabStatus.emit(this.gitlabIsLive);
          observer.next(this.gitlabIsLive);
          observer.complete();
        },
        (error) => {
          this.everythingIsLive = false;
          this.gitlabIsLive = false;
          this.gitlabStatus.emit(this.gitlabIsLive);
          console.error('LivenessService: Gitlab is down');
          observer.error('Gitlab is down');
        },
      );
    });
  }

  checkBackend() {
    return Observable.create((observer) => {
      this.http.get(this.backendBaseUrl).subscribe(
        (response) => {
          this.backendIsLive = true;
          this.backendStatus.emit(this.backendIsLive);
          observer.next(this.backendIsLive);
          observer.complete();
        },
        (error) => {
          this.everythingIsLive = false;
          this.backendIsLive = false;
          this.backendStatus.emit(this.backendIsLive);
          console.error('LivenessService: Backend is down');
          observer.error('Backend is down');
        },
      );
    });
  }
}
