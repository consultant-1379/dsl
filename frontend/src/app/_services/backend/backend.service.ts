import { Injectable } from '@angular/core';
import { ConfigService } from '../config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LocalStorageService } from '../local-storage.service';

@Injectable()
export class BackendService {
  dslBackendUrl: any;

  constructor(public configService: ConfigService, private _http: HttpClient,
              private localStorageService: LocalStorageService) {
    this.dslBackendUrl = configService.getDSLBackendDetails('URL');
  }

  pushProjectFilesToGitlab(projectName: string, uniqueId: string) {

    const user = this.localStorageService.getUser();

    return this._http.post(`${this.dslBackendUrl}/project/publish/${user._id}/${uniqueId}/${projectName}`, user);
  }

  getUploadedFiles(userId: string, uniqueId: string): Observable<string[]> {
    return this._http.get<string[]>(`${this.dslBackendUrl}/fileManager/ls/${userId}/${uniqueId}`);
  }

  deleteUploadedFiles(userId: string) {
    return this._http.get(`${this.dslBackendUrl}/project/cancel/${userId}`);
  }

  createUploadDirectory(userId: string, uniqueId: string) {
    return this._http.post(`${this.dslBackendUrl}/fileManager/mkdir/`, { username: userId, uniqueid: uniqueId });
  }

  cancelProject(userId: string) {
    return this._http.get(`${this.dslBackendUrl}/project/cancel/${userId}`);
  }

  getInfo() {
    return this._http.get(this.dslBackendUrl);
  }
}
