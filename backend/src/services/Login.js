/* ============================================================================
 * Ericsson Data Science Lounge Frontend
 *
 * Login.js - A service to handle login logic
 * ============================================================================
 */
import UserService from './data/UserService';
import GitlabApi from './git/GitlabApi';

export default class Login {
  static logUserIn(ldapUser) {
    const userService = new UserService();
    let userFromDB;
    let userFromGitlab;
    return userService.getUser(ldapUser.signum)
      .then((response) => {
        userFromDB = response;
        return GitlabApi.getUser(ldapUser.signum);
      })
      .then((response) => {
        userFromGitlab = response;
        if (userFromDB && userFromGitlab) {
          // user already exists
          return userFromDB;
        }
        if (!userFromDB && !userFromGitlab) {
          // user does not exist, create the user
          return Login.createNewUser(ldapUser);
        }
        const error = new Error(`The user exists in couchDB or gitlab, but not both. The user in couchDB is: ${JSON.stringify(userFromDB)}. The user in Gitlab is: ${JSON.stringify(userFromGitlab)}.`);
        error.userFriendlyError = 'Sorry, there is a problem with your account, please contact the Data Science Lounge team for help.';
        throw error;
      });
  }

  /*
   * Creates a user in CouchDB and Gitlab
   * Returns the new user object created in CouchDB
   */
  static createNewUser(ldapUser) {
    let gitlabUser;
    const userService = new UserService();
    return GitlabApi.createUser(ldapUser, '12345678')
      .then((newGitlabUser) => {
        gitlabUser = newGitlabUser;
        /* eslint-disable arrow-body-style */
        return userService.createUser(ldapUser)
          .catch((error) => {
            // there was a problem creating the user in CouchDB - roll back user creation
            return GitlabApi.deleteUserByGitlabId(gitlabUser.id)
              .then(() => {
                throw new Error(`Error while creating the new user: ${error}`);
              });
          });
      });
  }
}
