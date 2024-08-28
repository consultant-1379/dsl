/* ============================================================================
 * Ericsson Data Science Lounge Frontend
 *
 * voting.service.ts - Allows users to upvote projects in DSL
 * ============================================================================
 */
import { Injectable } from '@angular/core';
import { Project } from '../../_models/project';
import { Vote } from '../../_models/vote';
import { LocalStorageService } from '../local-storage.service';
declare var require: any;
const PouchFind = require('pouchdb-find').default;
const PouchDB = require('pouchdb-browser').default;
PouchDB.plugin(PouchFind);
import { ProjectService } from './project.service';
import { ConfigService } from '../config.service';
import { UserVotes } from 'src/app/_models/userVotes';

@Injectable()
export class VotingService {

  readonly db: any;

  constructor(
        private projectService: ProjectService,
        private localStorageService: LocalStorageService,
        private configService: ConfigService,
  ) {
    this.db = new PouchDB(configService.getDatabaseApi('COUCHDB_LOCAL'));
  }

  /*
   * upvotes or downvotes a project, depending on whether the user has
   * already voted for the project
   */
  public voteForProject(project: Project): Promise<any> {
    return this.getOrCreateUserVotes()
      .then((userVotes) => {
        if (this.userHasAlreadyVotedForProject(project._id, userVotes)) {
          return this.downvoteProject(project._id, userVotes)
            .then(() => {
              project.votes -= 1;
            });
        }
        return this.upvoteProject(project._id, userVotes)
          .then(() => {
            project.votes += 1;
          });
      });
  }

  /*
   * gets the user's votes from the database. If no UserVotes record
   * is in the database for the current user, it creates one and returns that.
   */
  private getOrCreateUserVotes() {
    return this.getUserVotes()
      .then((userVotes) => {
        return userVotes;
      })
      .catch(() => {
        // no UserVotes record exists in the database for this user
        return this.createUserVotes()
          .then(() => {
            return this.getUserVotes();
          });
      });
  }

  // retrieve UserVotes for current user from the database
  public getUserVotes(): Promise<UserVotes> {
    const user = this.localStorageService.getUser();
    return this.db.find({ selector: {
      userId: user._id,
      type: 'userVotes',
    }})
      .then((result) => {
        const userVotes: UserVotes = result.docs[0];
        if (userVotes) {
          return userVotes;
        }
        console.log(`There was no UserVotes in the database with the id: ${user._id}`);
        throw new Error(`There was no UserVotes in the database with the id: ${user._id}`);
      });
  }

  // create UserVotes record in the database for the current user
  public createUserVotes(): Promise<any> {
    const userId = this.localStorageService.getUser()._id;
    const userVotes = new UserVotes();
    userVotes.userId = userId;
    return this.db.post(userVotes);
  }

  public userHasAlreadyVotedForProject(projectId: string, userVotes: UserVotes) {
    const voteForThisProject = userVotes.votes.find(vote => vote.projectId === projectId);
    if (voteForThisProject) {
      return true;
    }
    return false;
  }

  private downvoteProject(projectId: string, userVotes: UserVotes) {
    return this.projectService.getProjectById(projectId)
      .then((project) => {
        project.votes -= 1;
        this.removeVoteFromUserVotes(projectId, userVotes);
        return this.updateVotesInDB(project, userVotes);
      });
  }

  private removeVoteFromUserVotes(projectId: string, userVotes: UserVotes): void {
    const indexOfVote = userVotes.votes.findIndex(vote => vote.projectId === projectId);
    userVotes.votes.splice(indexOfVote, 1);
  }

  private upvoteProject(projectId: string, userVotes: UserVotes) {
    return this.projectService.getProjectById(projectId)
      .then((project) => {
        project.votes += 1;
        this.addVoteToUserVotes(projectId, userVotes);
        return this.updateVotesInDB(project, userVotes);
      });
  }

  private addVoteToUserVotes(projectId: string, userVotes: UserVotes): void {
    const newVote = new Vote(projectId);
    userVotes.votes.push(newVote);
  }

  private updateVotesInDB(project: Project, userVotes: UserVotes): Promise<any> {
    return this.db.bulkDocs([project, userVotes])
      .catch((error) => {
        console.error(`Error when updating votes in database: ${error}`);
        throw error;
      });
  }
}
