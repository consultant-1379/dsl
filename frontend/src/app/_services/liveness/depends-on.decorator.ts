import { getAppInjector } from '../../app-injector';
import { LivenessErrorHandlingService } from './liveness-error-handling.service';

export const DEFAULT_TOASTR_MESSAGE = 'This feature is not available right now. Apologies for the inconvenience.';

/*
 * THIS FUNCTION IS A DECORATOR
 * Before running the decorated function, this decorator checks to make
 * sure that all backend services (such as CouchDB) that the function depends
 * on are live
 */
// tslint:disable-next-line
export function DependsOn(dependencies: string[], toastrMessage?: string) {
  return function (target, key, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function () {
      const injector = getAppInjector();
      const livenessErrorHandlingService = injector.get(LivenessErrorHandlingService);
      let dependenciesAreLive = true;

      dependencies.forEach((dependency) => {
        const thisDependencyIsLive = livenessErrorHandlingService.checkStatus(dependency);
        dependenciesAreLive = (dependenciesAreLive && thisDependencyIsLive);
      });

      if (dependenciesAreLive) {
        originalMethod.apply(this, arguments);
      } else {
        livenessErrorHandlingService.showErrorPane();
        if (toastrMessage) {
          livenessErrorHandlingService.showToastr(toastrMessage);
        }
      }
    };
  };
}
