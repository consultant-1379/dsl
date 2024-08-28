import { LivenessService } from './liveness.service';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { nextTick } from 'q';

describe('LivenessService', () => {

  describe('performLivenessCheck', () => {

    let livenessService: LivenessService;

    describe('when all services are live', () => {

      beforeEach(() => {
        const httpMock = getSuccessfulHttpMock();
        const configServiceMock = getConfigServiceMock();
        livenessService = new LivenessService(httpMock, configServiceMock);
      });

      it('should return a successful observable', () => {
        return new Promise((resolve, reject) => {

          livenessService.performLivenessCheck().subscribe(
            () => { },
            (error) => {
              reject(`The observable threw an error: ${error}`);
            },
            () => {
              resolve();
            },
          );

        });
      });

      it('should set everythingIsLive to true', () => {
        return new Promise((resolve, reject) => {
          livenessService.everythingIsLive = false;

          livenessService.performLivenessCheck().subscribe(
            () => { },
            (error) => {
              reject(`The observable threw an error: ${error}`);
            },
            () => {
              expect(livenessService.everythingIsLive).toBe(true);
              resolve();
            },
          );

        });
      });

      it('should cause overallStatus to emit true', () => {
        return new Promise((resolve, reject) => {

          let status = false;
          livenessService.overallStatus.subscribe((emittedStatus) => {
            status = emittedStatus;
          });

          livenessService.performLivenessCheck().subscribe(
            () => { },
            (error) => {
              reject(`The observable threw an error: ${error}`);
            },
            () => {
              expect(status).toBe(true);
              resolve();
            },
          );

        });
      });
    });

    describe('when all services are down', () => {

      beforeEach(() => {
        const httpMock = getFailingHttpMock();
        const configServiceMock = getConfigServiceMock();
        livenessService = new LivenessService(httpMock, configServiceMock);
      });

      it('should return a failing observable', () => {
        return new Promise((resolve, reject) => {

          livenessService.performLivenessCheck().subscribe(
            () => {
              reject();
            },
            (error) => {
              resolve();
            },
            () => {
              reject();
            },
          );

        });
      });
    });

    describe('when one service is down', () => {

      beforeEach(() => {
        const httpMock = getHttpMockWithOneServiceFailing();
        const configServiceMock = getConfigServiceMock();
        livenessService = new LivenessService(httpMock, configServiceMock);
      });

      it('should return a failing observable', () => {
        return new Promise((resolve, reject) => {

          livenessService.performLivenessCheck().subscribe(
            () => {
              reject();
            },
            (error) => {
              resolve();
            },
            () => {
              reject('The observable completed instead of throwing an error');
            },
          );

        });
      });

      it('should set everythingIsLive to false', () => {
        return new Promise((resolve, reject) => {
          livenessService.everythingIsLive = true;

          livenessService.performLivenessCheck().subscribe(
            () => {
              reject();
            },
            (error) => {
              expect(livenessService.everythingIsLive).toBe(false);
              resolve();
            },
            () => {
              reject('The observable completed instead of throwing an error');
            },
          );

        });
      });

      it('should cause overallStatus to emit false', () => {
        return new Promise((resolve, reject) => {
          let status = true;
          livenessService.overallStatus.subscribe((emittedStatus) => {
            status = emittedStatus;
          });

          livenessService.performLivenessCheck().subscribe(
            () => {
              reject();
            },
            (error) => {
              expect(status).toBe(false);
              resolve();
            },
            () => {
              reject('The observable completed instead of throwing an error');
            },
          );

        });
      });
    });
  });

  describe('checkCouchDb', () => {

    let livenessService: LivenessService;

    describe('when couchDB is live', () => {

      beforeEach(() => {
        const httpMock = getSuccessfulHttpMock();
        const configServiceMock = getConfigServiceMock();
        livenessService = new LivenessService(httpMock, configServiceMock);
      });

      it('should set couchDbIsLive to true', () => {
        return new Promise((resolve, reject) => {
          livenessService.couchDbIsLive = false;

          livenessService.checkCouchDb().subscribe(
            (next) => { },
            (error) => {
              reject();
            },
            (complete) => {
              expect(livenessService.couchDbIsLive).toBe(true);
              resolve();
            },
          );
        });
      });

      it('should cause couchDbStatus to emit true', () => {
        return new Promise((resolve, reject) => {

          let status = false;
          livenessService.couchDbStatus.subscribe((emittedStatus) => {
            status = emittedStatus;
          });
          livenessService.checkCouchDb().subscribe(
            (next) => { },
            (error) => {
              reject();
            },
            (complete) => {
              expect(status).toBe(true);
              resolve();
            },
          );
        });
      });

    });

    describe('when couchDB is not live', () => {

      beforeEach(() => {
        const httpMock = getFailingHttpMock();
        const configServiceMock = getConfigServiceMock();
        livenessService = new LivenessService(httpMock, configServiceMock);
      });

      it('should set couchDbIsLive to false', () => {
        return new Promise((resolve, reject) => {

          livenessService.couchDbIsLive = true;

          livenessService.checkCouchDb().subscribe(
            (next) => {
              reject();
            },
            (error) => {
              expect(livenessService.couchDbIsLive).toBe(false);
              resolve();
            },
            (complete) => {
              reject();
            },
          );
        });
      });

      it('should cause couchDbStatus to emit false', () => {
        return new Promise((resolve, reject) => {

          let status = true;
          livenessService.couchDbStatus.subscribe((emittedStatus) => {
            status = emittedStatus;
          });
          livenessService.checkCouchDb().subscribe(
            (next) => {
              reject();
            },
            (error) => {
              expect(status).toBe(false);
              resolve();
            },
            (complete) => {
              reject();
            },
          );
        });
      });

    });

  });

  describe('checkGitlab', () => {

    let livenessService: LivenessService;

    describe('when gitlab is live', () => {

      beforeEach(() => {
        const httpMock = getSuccessfulHttpMock();
        const configServiceMock = getConfigServiceMock();
        livenessService = new LivenessService(httpMock, configServiceMock);
      });

      it('should set gitlabIsLive to true', () => {
        return new Promise((resolve, reject) => {
          livenessService.gitlabIsLive = false;

          livenessService.checkGitlab().subscribe(
            (next) => { },
            (error) => {
              reject();
            },
            (complete) => {
              expect(livenessService.gitlabIsLive).toBe(true);
              resolve();
            },
          );
        });
      });

      it('should cause gitlabStatus to emit true', () => {
        return new Promise((resolve, reject) => {
          let status = false;
          livenessService.gitlabStatus.subscribe((emittedStatus) => {
            status = emittedStatus;
          });
          livenessService.checkGitlab().subscribe(
            (next) => { },
            (error) => {
              reject();
            },
            (complete) => {
              expect(status).toBe(true);
              resolve();
            },
          );
        });
      });

    });

    describe('when gitlab is not live', () => {

      beforeEach(() => {
        const httpMock = getFailingHttpMock();
        const configServiceMock = getConfigServiceMock();
        livenessService = new LivenessService(httpMock, configServiceMock);
      });

      it('should set gitlabIsLive to false', () => {
        return new Promise((resolve, reject) => {
          livenessService.gitlabIsLive = true;

          livenessService.checkGitlab().subscribe(
            (next) => {
              reject();
            },
            (error) => {
              expect(livenessService.gitlabIsLive).toBe(false);
              resolve();
            },
            (complete) => {
              reject();
            },
          );
        });
      });

      it('should cause gitlabStatus to emit false', () => {
        return new Promise((resolve, reject) => {
          let status = true;
          livenessService.gitlabStatus.subscribe((emittedStatus) => {
            status = emittedStatus;
          });
          livenessService.checkGitlab().subscribe(
            (next) => {
              reject();
            },
            (error) => {
              expect(status).toBe(false);
              resolve();
            },
            (complete) => {
              reject();
            },
          );
        });
      });

    });

  });

  describe('checkBackend', () => {

    let livenessService: LivenessService;

    describe('when backend is live', () => {

      beforeEach(() => {
        const httpMock = getSuccessfulHttpMock();
        const configServiceMock = getConfigServiceMock();
        livenessService = new LivenessService(httpMock, configServiceMock);
      });

      it('should set backendIsLive to true', () => {
        return new Promise((resolve, reject) => {
          livenessService.backendIsLive = false;

          livenessService.checkBackend().subscribe(
            (next) => { },
            (error) => {
              reject();
            },
            (complete) => {
              expect(livenessService.backendIsLive).toBe(true);
              resolve();
            },
          );
        });
      });

      it('should cause backendStatus to emit true', () => {
        return new Promise((resolve, reject) => {
          let status = false;
          livenessService.backendStatus.subscribe((emittedStatus) => {
            status = emittedStatus;
          });
          livenessService.checkBackend().subscribe(
            (next) => { },
            (error) => {
              reject();
            },
            (complete) => {
              expect(status).toBe(true);
              resolve();
            },
          );
        });
      });

    });

    describe('when backend is not live', () => {

      beforeEach(() => {
        const httpMock = getFailingHttpMock();
        const configServiceMock = getConfigServiceMock();
        livenessService = new LivenessService(httpMock, configServiceMock);
      });

      it('should set backendIsLive to false', () => {
        return new Promise((resolve, reject) => {
          livenessService.backendIsLive = true;

          livenessService.checkBackend().subscribe(
            (next) => {
              reject();
            },
            (error) => {
              expect(livenessService.backendIsLive).toBe(false);
              resolve();
            },
            (complete) => {
              reject();
            },
          );
        });
      });

      it('should cause backendStatus to emit false', () => {
        return new Promise((resolve, reject) => {
          let status = true;
          livenessService.backendStatus.subscribe((emittedStatus) => {
            status = emittedStatus;
          });
          livenessService.checkBackend().subscribe(
            (next) => {
              reject();
            },
            (error) => {
              expect(status).toBe(false);
              resolve();
            },
            (complete) => {
              reject();
            },
          );
        });
      });

    });

  });

});

function getConfigServiceMock() {
  const configServiceMock = jasmine.createSpyObj('HttpClient', ['get', 'getDatabaseApi', 'getDSLBackendDetails']);
  configServiceMock.get.and.returnValue('');
  configServiceMock.getDatabaseApi.and.returnValue('');
  configServiceMock.getDSLBackendDetails.and.returnValue('');
  return configServiceMock;
}

function getSuccessfulHttpMock() {
  const httpMock = jasmine.createSpyObj('HttpClient', ['get']);
  httpMock.get.and.returnValue(Observable.create((observer) => {
    observer.next('success');
    observer.complete();
  }));
  return httpMock;
}

function getFailingHttpMock() {
  const httpMock = jasmine.createSpyObj('HttpClient', ['get']);
  httpMock.get.and.returnValue(Observable.create((observer) => {
    observer.error('fail');
  }));
  return httpMock;
}

function getHttpMockWithOneServiceFailing() {
  const httpMock = jasmine.createSpyObj('HttpClient', ['get']);
  httpMock.get.and.returnValues(
    Observable.create((observer) => {
      observer.next('success');
      observer.complete();
    }),
    Observable.create((observer) => {
      observer.error('fail');
    }),
    Observable.create((observer) => {
      observer.next('success');
      observer.complete();
    }),
  );
  return httpMock;
}
