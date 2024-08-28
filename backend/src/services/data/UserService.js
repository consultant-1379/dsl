/* ============================================================================
 * Ericsson Data Science Lounge Frontend
 *
 * UserService.js - Handles interactions with the database which involve users
 * ============================================================================
 */
import logger from '../logger';

const PouchDB = require('pouchdb');
const PouchFind = require('pouchdb-find');

PouchDB.plugin(PouchFind);

/* eslint-disable no-underscore-dangle */
export default class UserService {
  constructor() {
    this.db = new PouchDB(process.env.COUCHDB_URL);
  }

  getUser(userId) {
    logger.log('info', 'Getting user from CouchDB');
    return new Promise((resolve, reject) => {
      this.db.find({ selector: { type: 'user', _id: userId } })
        .then((result) => {
          const user = result.docs[0];
          resolve(user);
        })
        .catch((error) => {
          logger.error('error', `Error getting user from CouchDB: ${error}`);
          reject(error);
        });
    });
  }

  createUser(ldapUser) {
    logger.log('info', 'Creating user in database');
    const newUser = UserService.ldapUserToDbUser(ldapUser);
    return this.db.put(newUser)
      .catch((error) => {
        logger.log('error', `Error creating user in CouchDB: ${error}`);
        throw error;
      })
      // the following then block will only be executed if user was created successfully
      .then(() => this.getUser(newUser._id));
  }

  deleteUser(userId) {
    logger.log('info', 'Deleting user from CouchDB');
    return this.getUser(userId)
      .then(user => this.db.remove(user._id, user.rev))
      .catch((error) => {
        logger.log('error', `Error deleting the user in CouchDB: ${error}`);
        throw error;
      });
  }

  static ldapUserToDbUser(ldapUser) {
    const dbUser = {};
    dbUser._id = ldapUser.signum;
    dbUser.type = 'user';
    dbUser.displayName = ldapUser.displayName;
    dbUser.email = ldapUser.mail;
    dbUser.modified = new Date(Date.now());
    dbUser.visits = 1;
    return dbUser;
  }
}
