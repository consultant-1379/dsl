declare var require: any;
const PouchFind = require('pouchdb-find').default;
const PouchDB = require('pouchdb-browser').default;
PouchDB.plugin(PouchFind);

import { Injectable, NgZone } from '@angular/core';

import { ConfigService } from '../config.service';
import { Project } from '../../_models/project';
import { DslComment } from 'src/app/_models/dsl-comment';

@Injectable()
export class ProjectService {

  readonly db: any;

  constructor(
    private configService: ConfigService,
  ) {
    this.db = new PouchDB(configService.getDatabaseApi('COUCHDB_LOCAL'));
  }

  getProjectById(id: string) {
    return this.getSingleProjectBySelector({ type: 'project', _id: id });
  }

  getProjectByProjectNameAndAuthor(projectName: string, author: string) {
    return this.getSingleProjectBySelector(
      { author, type: 'project', projectname: projectName });
  }

  getProjects() {
    return this.getProjectsBySelector({ type: 'project', public: true });
  }

  getFeaturedProjects() {
    return this.getProjectsBySelector(
      { type: 'project', public: true, featured: true });
  }

  getLatestProjects() {
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

    return this.getProjectsBySelector({
      type: 'project',
      public: true,
      created: { $gt: oneMonthAgo.toJSON() },
    });
  }

  getProjectsBySelector(querySelector: {}): Promise<Project[]> {
    return new Promise((resolve) => {
      this.db.find({ selector: querySelector })
        .then((result) => {
          console.log(result);
          const projects: Project[] = [];

          const docs = result.docs.map(
            (row) => { this.getProjectFromRow(row, projects); });
          resolve(projects);
        })
        .catch((error) => { console.log(error); });
    });
  }

  getSingleProjectBySelector(querySelector: {}): Promise<Project> {
    return new Promise((resolve, reject) => {
      this.db.find({ selector: querySelector })
        .then((result) => {
          console.log(result);
          const projects: Project[] = [];

          const docs = result.docs.map(
            (row) => { this.getProjectFromRow(row, projects); });
          resolve(projects[0]);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  private getProjectFromRow(row: any, data: any) {
    row.created = new Date(row.created);
    data.push(row);
  }

  updateProject(project: Project) {
    return this.getProjectById(project._id)
          .then((projectBeforeUpdate) => {
            project._rev = projectBeforeUpdate._rev;
            project.type = 'project';
            return this.db.put(project);
          });
  }

  createProject(project: Project) {
    const newProject: any = {};
    newProject.author = project.author;
    newProject.authorDisplayName = project.authorDisplayName;
    newProject.type = 'project';
    newProject.projectname = project.projectname;
    newProject.description = project.description;
    newProject.category = project.category;
    newProject.public = project.public;
    newProject.featured = project.featured;
    newProject.votes = 0;
    newProject.linkToFile = project.linkToFile;
    newProject.comments = [];
    newProject.hashtags = project.hashtags;
    newProject.created = new Date(Date.now()).toJSON();
    return this.db.post(newProject);
  }

  deleteProject(projectId: string): Promise<any> {
    return this.getProjectById(projectId).then(
            project => this.db.remove(project));
  }

  addComment(projectId: string, comment: DslComment): Promise<Project> {
    let updatedProject: Project;
    return this.getProjectById(projectId)
          .then((project) => {
            project.comments.push(comment);
            updatedProject = project;
            return this.db.put(project);
          })
          .then(() => {
            return updatedProject;
          });
  }

  deleteComment(projectId: string, commentToDelete: DslComment): Promise<Project> {
    let updatedProject: Project;
    return this.getProjectById(projectId)
      .then((project) => {
        const deleteIndex = project.comments
          .findIndex(comment => comment.created === commentToDelete.created && comment.user === commentToDelete.user);
        project.comments.splice(deleteIndex, 1);
        updatedProject = project;
        return this.db.put(project);
      })
      .then(() => {
        return updatedProject;
      });
  }

}
