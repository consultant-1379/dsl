/* ============================================================================
 * Ericsson Data Science Lounge Backend
 *
 * GitHandler.js - A utility class to help with git operation.
 * ============================================================================
 */
import nodegit from 'nodegit';
import empty from 'empty-folder';
import path from 'path';
import logger from '../logger';

require('../../config/environment.js');

// TODO: Extract config parameter
const PROJECTS_LOCATION = 'projects';

class GitHandler {
  constuctor() {
    this.baseURL = null;
    this.projectname = null;
    this.username = null;
  }

  setProjectName(name) {
    this.projectname = name.replace(/\s+/g, '-');
  }

  setUrl(username) {
    this.baseURL = `${process.env.BASE_URL_GITLAB}/${username}/${this.projectname}.git`;
    logger.log('debug', `The base Git URL is: ${this.baseURL}`);
  }

  getRepo(userId, uniqueId) {
    return new Promise((resolve, reject) => {
      logger.log('debug', 'Cloning the user\'s repo.');
      const proj = this.baseURL;
      const localPath = path.posix.join(PROJECTS_LOCATION, userId, uniqueId, this.projectname);
      logger.log('info', localPath);
      nodegit.Clone(proj, localPath)
        .then((repo) => {
          logger.log('info', `Cloned to: ${repo.workdir()}`);
          resolve(repo.workdir());
        })
        .catch((err) => {
          // FIXME: Need to clean up after.
          logger.log('debug', 'Could not clone.');
          logger.log('error', err);
          GitHandler.deleteRepoInLocal(userId);
          reject(new Error('There was an error while cloning the new repository'));
        });
    });
  }

  commitInRepo(userInfo, uniqueId) {
    /* eslint-disable no-underscore-dangle */
    return new Promise((resolve, reject) => {
      let repositoryRef = null;
      let indexRef = null;
      const repoPath = path.join(PROJECTS_LOCATION, userInfo._id, uniqueId, this.projectname, '.git');
      nodegit.Repository.open(repoPath)
        .then((repository) => {
          repositoryRef = repository;
          return repository;
        })
        .then(repository => repository.refreshIndex())
        .then((index) => {
          logger.log('info', `the index is: ${index}`);
          indexRef = index;
          return index;
        })
        .then(index => index.addAll('*')) // 0 on success, negative callback return value, or error code
        .then(() => indexRef.write())
        .then(() => indexRef.writeTree())
        /* eslint-disable no-underscore-dangle */
        .then((oid) => { // oid is the sha1 of this commit
          logger.log('debug', `userInfo: ${userInfo}`);
          const time = new Date();
          const author = nodegit.Signature.create(userInfo._id, userInfo.email,
            time.getTime() / 1000, 0);
          const committer = nodegit.Signature.create(userInfo._id, userInfo.email,
            time.getTime() / 1000, 0);
          return repositoryRef.createCommit('HEAD', author, committer, 'Publishing my DSL project', oid, []);
        })
        .then((commitId) => {
          logger.log('debug', `Commit-ID: ${commitId}`);
          resolve(repositoryRef);
        })
        .catch((error) => {
          logger.log('error', 'There was an error commiting the repo');
          reject(error);
        });
    });
  }

  pushToRepo(userInfo, uniqueId) {
    return new Promise((resolve, reject) => {
      const repoPath = path.join(PROJECTS_LOCATION, userInfo._id, uniqueId, this.projectname, '.git');
      nodegit.Repository.open(repoPath)
        .then(repository => repository.getRemote('origin'))
        .then(remote => remote.push(['refs/heads/master:refs/heads/master'], {
          callbacks:
            {
              // FIX ME I need to be ssh instead of plaintext
              credentials() {
                return nodegit.Cred.userpassPlaintextNew(userInfo._id, '12345678');
              },
            },
        }))
        .then(() => {
          logger.log('info', 'Push success!');
          resolve();
        })
        .catch((error) => {
          logger.log('error', 'There was an error while pushing the project files to Gitlab');
          reject(error);
        });
    });
  }

  static deleteRepoInLocal(userId) {
    empty(path.join(PROJECTS_LOCATION, userId), false, (o) => {
      if (o.error) {
        logger.log('error', `${o.error}`);
      }
    });
  }
}

module.exports = GitHandler;
