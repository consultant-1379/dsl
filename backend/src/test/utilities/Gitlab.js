/* eslint-disable */
import request from 'supertest';
import ProjectData from '../data/ProjectData';
import UserData from '../data/UserData';

export default class Gitlab {
  /*
   * Creates a test repository in Gitlab
   */
  static createRepositoryInGitlab(gitlabId) {
    return new Promise((resolve, reject) => {
      const gitlabBaseUrl = process.env.BASE_URL_GITLAB;
      const gitlabToken = process.env.GITLAB_TOKEN;
      request(gitlabBaseUrl)
        .post(`/api/v4/projects/user/${gitlabId}?private_token=${gitlabToken}&visibility=public`)
        .send({
          description: 'This is a test project',
          name: ProjectData.projectName,
        })
        .expect(201)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }


  /*
   * Creates a test user in gitlab and returns its gitlab Id.
   * If a user called testuser already exist, it returns the gitlab Id
   *  of that user and does not create a new user
   */
  static createGitlabUser() {
    return new Promise(async (resolve, reject) => {
      const gitlabId = await Gitlab.getGitlabIdByUsername(UserData.userId);

      if (gitlabId > 0) {
        resolve(gitlabId);
      } else {
        const gitlabBaseUrl = process.env.BASE_URL_GITLAB;
        const gitlabToken = process.env.GITLAB_TOKEN;
        console.log(`base url: ${gitlabBaseUrl}`);
        console.log(`token: ${gitlabToken}`);
        request(gitlabBaseUrl)
          .post(`/api/v4/users?private_token=${gitlabToken}`)
          .set('Accept', 'application/json')
          .send({
            email: 'test@test.com',
            username: 'testuser',
            name: 'Test User',
            password: '12345678',
            skip_confirmation: 'true',
          })
          .expect(201)
          .then((response) => {
            // return the gitlab id of the user that we just created
            const newUserGitlabId = response.body.id;
            resolve(newUserGitlabId);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  }

  /*
   * Returns the gitlab id of a user
   * If the user is not found it returns -1
   */
  static getGitlabIdByUsername(username) {
    return new Promise((resolve, reject) => {
      const gitlabBaseUrl = process.env.BASE_URL_GITLAB;
      const gitlabToken = process.env.GITLAB_TOKEN;
      request(gitlabBaseUrl)
        .get(`/api/v4/users?username=${username}&private_token=${gitlabToken}`)
        .expect(200)
        .then((response) => {
          if (response.body.length > 0) {
            resolve(response.body[0].id);
          } else {
            resolve(-1);
          }
        })
        .catch((error) => {
          resolve(-1);
        });
    });
  }

  static deleteGitlabUser(gitlabId) {
    return new Promise((resolve, reject) => {
      const gitlabBaseUrl = process.env.BASE_URL_GITLAB;
      const gitlabToken = process.env.GITLAB_TOKEN;
      request(gitlabBaseUrl)
        .delete(`/api/v4/users/${gitlabId}?hard_delete=true&private_token=${gitlabToken}`)
        .expect(204)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /*
   * Returns a promise which resolves to either true or
   * false, depending on whether the project
   */
  static checkGitlabProjectExists() {
    return new Promise((resolve, reject) => {
      const gitlabBaseUrl = process.env.BASE_URL_GITLAB;
      request(gitlabBaseUrl)
        .get(`/api/v4/projects/${UserData.userId}%2F${ProjectData.projectName}`)
        .expect(200)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          resolve(false);
        });
    });
  }
}
