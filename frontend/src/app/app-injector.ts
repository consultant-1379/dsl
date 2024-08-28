/* ============================================================================
 * Ericsson Data Science Lounge Frontend
 *
 * app-injector.ts - Provides a global reference to the app-level injector
 *  This global reference should only be needed in RARE CIRCUMSTANCES!!
 * ============================================================================
 */
import { Injector } from '@angular/core';

let appInjectorRef: Injector;
let appInjectorRefHasBeenSet = false;

export const getAppInjector = () => appInjectorRef;

export const setAppInjector = (injector: Injector) => {
  if (appInjectorRefHasBeenSet) {
    throw new Error('appInjectorRef has already been set!');
  }
  appInjectorRef = injector;
  appInjectorRefHasBeenSet = true;
};
