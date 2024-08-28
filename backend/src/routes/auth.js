import express from 'express';
import passport from 'passport';
import LdapStrategy from 'passport-ldapauth';
import { ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import logger from '../services/logger';
import Login from '../services/Login';

require('../config/environment');

const router = express.Router();

// If testing we need to mock JWT.
let JwtStrategy = null;
if (process.env.NODE_ENV === 'test') {
// eslint-disable-next-line global-require,import/no-extraneous-dependencies
  JwtStrategy = require('passport-jwt-mock').Strategy;
} else {
// eslint-disable-next-line global-require
  JwtStrategy = require('passport-jwt').Strategy;
}
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

// Dummy payload for testing.
if (process.env.NODE_ENV === 'test') {
  jwtOptions.payload = {
    signum: 'testsig',
    displayName: 'Test User',
    mail: 'test@user.com',
  };
}

passport.use(new JwtStrategy(
  jwtOptions,
  (jwtPayload, done) => {
    if (jwtPayload.signum) {
      const { signum, displayName, mail } = jwtPayload;
      return done(null, {
        signum,
        displayName,
        mail,
      });
    }
    return done('User not found.', false);
  },
));

passport.use(new LdapStrategy({
  server: {
    url: process.env.LDAP_SERVER,
    bindDN: `uid=${process.env.LDAP_USER},OU=users,OU=Internal,O=Ericsson`,
    searchBase: 'o=Ericsson',
    bindCredentials: `${process.env.LDAP_PASSWORD}`,
    searchAttributes: ['uid', 'mail', 'displayName'],
    searchFilter: 'uid={{username}}',
  },
}));

router.post('/login', passport.authenticate('ldapauth', { session: false }),
  (req, res) => {
    const { uid, displayName, mail } = req.user;
    const userFromLDAP = { signum: uid.toLowerCase(), displayName, mail };
    logger.log('debug', `User from LDAP: ${JSON.stringify(userFromLDAP)}`);
    Login.logUserIn(userFromLDAP)
      .then((userFromDB) => {
        const token = jwt.sign(userFromLDAP, process.env.JWT_SECRET);
        return res.json({ user: userFromDB, token });
      })
      .catch((error) => {
        logger.log('error', `Error during login: ${error}`);
        const responseBody = {
          response: 'Login failed',
          userFriendlyError: error.userFriendlyError,
        };
        res.status(500);
        res.json(responseBody);
      });
  });

module.exports = router;
