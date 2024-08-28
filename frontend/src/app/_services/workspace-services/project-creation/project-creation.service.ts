import { Injectable } from '@angular/core';

import { GitlabProject } from '../../../_models/gitlab/gitlab-project';
import { Project } from '../../../_models/project';
import { GitService } from '../../git.service';
import { LocalStorageService } from '../../local-storage.service';
import { ProjectService } from '../../data/project.service';
import { BackendService } from '../../backend/backend.service';

@Injectable()
export class ProjectCreationService {

  constructor(
    private gitService: GitService,
    private projectService: ProjectService,
    private backendService: BackendService,
    private localStorageService: LocalStorageService) { }

  createProject(gitlabUserId: string, project: Project, uniqueId: string) {

    return new Promise((resolve, reject) => {
      const userId = this.getUserId();
      this.createProjectInGitlab(project, gitlabUserId).then(() => {
        return this.pushFilesToGitlabRepository(project, userId, uniqueId);
      }).then(() => {
        return this.saveProjectToDatabase(project, userId);
      }).then(() => {
        resolve();
      }).catch((error) => {
        console.error(`Project publication failed: ${error}`);
        reject(error);
      });
    });

  }

  private createProjectInGitlab(project: Project, gitlabUserId: string) {

    return new Promise((resolve, reject) => {

      const gitlabProject = this.convertToGitlabProject(project);
      this.gitService.createProject(gitlabUserId, gitlabProject).subscribe(
        () => {
          resolve();
        },
        (error) => {
          reject(`An error occurred while creating the project in Gitlab: ${error}`);
        },
      );

    });
  }

  private convertToGitlabProject(project: Project): GitlabProject {
    const gitlabProject = new GitlabProject();
    gitlabProject.name = project.projectname;
    gitlabProject.description = project.description;
    return gitlabProject;
  }

  private pushFilesToGitlabRepository(project: Project, userId: string, uniqueId: string) {

    return new Promise((resolve, reject) => {

      this.backendService.pushProjectFilesToGitlab(project.projectname, uniqueId).subscribe(
        (x) => {
          console.log(`next =${x}`);
        },
        (error) => {
          console.error(`Error when pushing project files from dsl_backend to Gitlab: ${error}`);
          this.removeProjectFromGitlab(project, userId).then(() => {
            return this.deleteUploadedFiles(userId);
          }).then(() => {
            console.log('Project creation was successfully rolled back');
            this.ensureProjectIsDeletedFromGitlab(project.projectname, userId, 10, () => {
              reject(`An error occured while pushing files from dsl_backend to Gitlab: ${error}`);
            });
          }).catch((rollbackError) => {
            console.error(`An error occured while rolling back project creation: ${rollbackError}`);
            reject(`An error occured while pushing files from dsl_backend to Gitlab: ${error}`);
          });
        },
        () => {
          resolve('Push to gitlab complete.');
        },
      );
    });

  }

  private saveProjectToDatabase(project: Project, userId: string): Promise<any> {

    return new Promise((resolve, reject) => {
      this.projectService.createProject(project).then(() => {
        resolve();
      }).catch((error) => {
        this.removeProjectFromGitlab(project, userId).then(() => {
          console.log('Project creation was successfully rolled back');
          this.ensureProjectIsDeletedFromGitlab(project.projectname, userId, 10, () => {
            reject(`An error occured saving the project to the database: ${error}`);
          });
        }).catch((rollbackError) => {
          console.error(`An error occured while rolling back project creation: ${rollbackError}`);
          reject(`An error occured saving the project to the database: ${error}`);
        });

      });
    });
  }

  getUserId() {
    const user = this.localStorageService.getUser();
    return user._id;
  }

  private removeProjectFromGitlab(project: Project, userId: string) {
    return this.gitService.deleteProject(userId, project.projectname).toPromise();
  }

  private deleteUploadedFiles(userId: string) {
    return this.backendService.deleteUploadedFiles(userId).toPromise();
  }

  private ensureProjectIsDeletedFromGitlab(projectName: string, username: string, retries: number, callback: Function) {
    // When you send a DELETE http request to Gitlab to delete a project, Gitlab usually takes a few milliseconds
    // to complete the deletion of the project. Therefore to be sure that the project has been successfully deleted,
    // we poll Gitlab to see if the project still exists
    if (retries === 0) {
      console.error('Error, has not been deleted');
      callback();
      return;
    }
    this.gitService.getProjectByUsernameAndProjectName(username, projectName).subscribe(
      () => {
        // projects still exist, try again
        setTimeout(() => {
          this.ensureProjectIsDeletedFromGitlab(projectName, username, retries - 1, callback);
        },         100);
      },
      () => {
        // the project was not found, it has been deleted sucessfully
        callback();
      },
    );
  }

}
