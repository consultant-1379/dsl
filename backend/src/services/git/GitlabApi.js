/* ============================================================================
 * Ericsson Data Science Lounge Frontend
 *
 * GitlabApi.js - A service for interacting with the Gitlab Api
 * ============================================================================
 */
import request from 'superagent';
import logger from '../logger';

export default class GitlabApi {
  static getUser(signum) {
    logger.log('info', 'Getting user from Gitlab');
    return request.get(`${process.env.BASE_URL_GITLAB}/api/v4/users?username=${signum}`)
      .then((res) => {
        const user = res.body[0];
        return user;
      });
  }

  static createUser(ldapUser, password) {
    logger.log('info', 'Creating user in Gitlab');
    const gitlabUser = GitlabApi.ldapUserToGitlabUser(ldapUser, password);
    return request.post(`${process.env.BASE_URL_GITLAB}/api/v4/users?private_token=${process.env.GITLAB_TOKEN}`)
      .send(gitlabUser)
      .then((res) => {
        const newGitlabUser = res.body;
        return newGitlabUser;
      });
  }

  static ldapUserToGitlabUser(ldapUser, password) {
    const userDetails = {
      password,
      email: ldapUser.mail,
      username: ldapUser.signum,
      name: ldapUser.displayName,
      skip_confirmation: 'true',
    };
    return userDetails;
  }

  static deleteUserByGitlabId(gitlabId) {
    logger.log('info', 'Deleting the user from Gitlab');
    const gitlabBaseUrl = process.env.BASE_URL_GITLAB;
    const gitlabToken = process.env.GITLAB_TOKEN;
    return request(gitlabBaseUrl)
      .delete(`/api/v4/users/${gitlabId}?private_token=${gitlabToken}`);
  }
}
module.exports = GitlabApi;
