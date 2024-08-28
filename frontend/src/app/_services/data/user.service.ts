declare var require: any;
const PouchFind = require('pouchdb-find').default;
const PouchDB = require('pouchdb-browser').default;
PouchDB.plugin(PouchFind);

import { Injectable } from '@angular/core';

import { ConfigService } from '../config.service';
import { User } from 'src/app/_models/user';

@Injectable()
export class UserService {

  readonly db: any;

  constructor(private configService: ConfigService) {
    this.db = new PouchDB(configService.getDatabaseApi('COUCHDB_LOCAL'));
  }

  getUser(_signum: string): Promise<User> {

    return new Promise((resolve, reject) => {
      this.db.find({ selector: { type: 'user', _id: _signum } })
                .then((result) => {
                  const user: User = result.docs[0];
                  resolve(user);
                })
                .catch((error) => {
                  reject(`There was an error getting the user: ${JSON.stringify(error)}`);
                });
    });
  }
}
