import { Injectable, APP_INITIALIZER } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
import { environment } from '../../environments/environment'; // path to your environment files

@Injectable()
export class ConfigService {
  private _config: Object;
  private _env: string;
  private _name: string;

  constructor(private _http: Http) { }
  load() {
    return new Promise((resolve, reject) => {
      this._env = 'development';
      this._name = environment.name;
      if (environment.production) { this._env = 'production'; }
      console.log(`Environment/Config is ${this._env}/${this._name}.`);
      this._http.get(`./assets/config/${this._name}.json`)
        .pipe(map(res => res.json()))
        .subscribe((data) => {
          this._config = data;
          resolve(true);
        },
                   (error: any) => {
                     console.error(error);
                     return Observable.throw(error.json().error || 'Server error');
                   });
    });
  }
    // Is app in the development mode?
  isDevmode() {
    return this._env === 'development';
  }
    // Gets API route based on the provided key
  getWordPressApi(api: string, key: string): string {
    return this._config['BASE_URL_WORDPRESS'] + this._config[api][key];
  }
  getGitApi(api: string, key: string): string {
    return this._config['BASE_URL_GITLAB'] + this._config[api][key];
  }
  getApi(api: string, key: string): string {
    return this._config[`BASE_URL_${api}_API`] + this._config[api][key];
  }
  getDatabaseApi(key: string): string {
    return this._config['DATABASE'][key];
  }

    // Return DSL Backend related config settings.
  getDSLBackendDetails(key: string): string {
    return this._config['DSL_BACKEND'][key];
  }

    // Gets a value of specified property in the configuration file
  get(key: any) {
    return this._config[key];
  }
}

export function configFactory(config: ConfigService) {
  return () => config.load();
}

export function init() {
  return {
    provide: APP_INITIALIZER,
    useFactory: configFactory,
    deps: [ConfigService],
    multi: true,
  };
}

const ConfigModule = {
  init,
};

export { ConfigModule };
