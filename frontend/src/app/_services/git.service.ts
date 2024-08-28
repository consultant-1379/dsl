import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

import { User } from '../_models/user';

@Injectable()
export class GitService {
  constructor(public configService: ConfigService, private http: HttpClient) {}

  getUserBySignum(userid: string) {
    return this.http.get(this.configService.getGitApi('GITLAB', 'USER_BY_SIGNUM').replace(':userid', userid));
  }

  getProjectById(projectId: number) {
    const projectStr = `${projectId}`;
    return this.http.get(
      this.configService
      .getGitApi('GITLAB', 'PROJECT_BY_ID')
      .replace(':projectid', projectStr)
      .replace('%token%',
               this.configService.get('GITLAB_PRIVATE_TOKEN')),
    );
  }

  getProjectByUsernameAndProjectName(username: string, projectName: string)  {
    const hyphenatedProjectName = projectName.replace(/\s+/g, '-');
    return this.http.get(
      this.configService
      .getGitApi('GITLAB', 'PROJECT_BY_USERNAME_AND_PROJECTNAME')
      .replace(':signum', username)
      .replace(':projectname', hyphenatedProjectName),
    );
  }

  getAllProjects() {
    return this.http.get(
      this.configService
      .getGitApi('GITLAB', 'PROJECTS')
      .replace('%token%', this.configService.get('GITLAB_PRIVATE_TOKEN')),
    );
  }

  getProjectsByUser(userid: string) {
    return this.http.get(
      this.configService
      .getGitApi('GITLAB', 'PROJECTS_USER')
      .replace(':userid', userid)
      .replace('%token%', this.configService.get('GITLAB_PRIVATE_TOKEN')),
    );
  }

  getRepository(projectid: string) {
    return this.http.get(
      this.configService
        .getGitApi('GITLAB', 'REPOSITORY')
        .replace(':projectid', projectid)
        .replace('%token%', this.configService.get('GITLAB_PRIVATE_TOKEN')),
    );
  }

  getRepositoryFiles(projectid: string, filepath: string) {
    return this.http.get(
      this.configService
        .getGitApi('GITLAB', 'REPOSITORY_FILES')
        .replace(':projectid', projectid)
        .replace(':filepath', filepath)
        .replace('%token%', this.configService.get('GITLAB_PRIVATE_TOKEN')),
    );
  }

  getFile(projectid: string, filepath: string) {
    return this.http.get(
      this.configService
        .getGitApi('GITLAB', 'FILE_GET')
        .replace(':projectid', projectid)
        .replace(':filepath', filepath),
    );
  }

  createProject(userid: string, project: any) {
    return this.http.post(
      this.configService
        .getGitApi('GITLAB', 'PROJECTS_CREATE')
        .replace(':userid', userid)
        .replace('%token%', this.configService.get('GITLAB_PRIVATE_TOKEN')),
      project,
    );
  }

  deleteProject(userid: string, projectName: string) {
    const hyphenatedProjectName = projectName.replace(/\s+/g, '-');
    return this.http.delete(
      this.configService
        .getGitApi('GITLAB', 'PROJECTS_DELETE')
        .replace(':signum', userid)
        .replace(':projectname', hyphenatedProjectName)
        .replace('%token%', this.configService.get('GITLAB_PRIVATE_TOKEN')),
      );
  }

  createFile(projectid: string, filepath: string, filecontent: any) {
    return this.http.post(
      this.configService.getGitApi('GITLAB', 'FILE_CREATE')
        .replace(':projectid', projectid)
        .replace(':filepath', filepath),
      filecontent,
    );
  }
  deleteFile(user: string, projectid: string, filepath: string, filecontent: any) {
    return this.http.delete(
      this.configService
        .getGitApi('GITLAB', 'FILE_DELETE')
        .replace(':projectid', projectid)
        .replace(':filepath', filepath)
        .replace('%token%', this.configService.get('GITLAB_PRIVATE_TOKEN'))
        .replace(':projectid', projectid)
        .replace(':user', user),
      filecontent,
      );
  }

  private getUserDetailsObject(user: User, password: string) {
    const userDetails = {
      password,
      email: user.email,
      username: user._id,
      name: user.displayName,
      skip_confirmation: 'true',
    };
    return userDetails;
  }

}
