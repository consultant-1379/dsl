import { enableProdMode, ComponentRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { setAppInjector } from './app/app-injector';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then((appRef) => {
    setAppInjector(appRef.injector);
  })
  .catch(err => console.log(err));
