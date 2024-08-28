import { Injectable } from '@angular/core';

import { User } from '../_models/user';

@Injectable()
export class LocalStorageService {
  // This service is a centralised point for all interactions with local storage

  private readonly USER_KEY: string = '_userDSL';
  private readonly JWT_TOKEN_KEY: string = 'jwt_token';

  constructor() { }

  getUser(): User {
    const user = localStorage.getItem(this.USER_KEY);
    if (user) {
      return JSON.parse(user) as User;
    }
  }

  setUser(user: User) {
    const userAsJsonString = JSON.stringify(user);
    localStorage.setItem(this.USER_KEY, userAsJsonString);
  }

  removeUser() {
    localStorage.removeItem(this.USER_KEY);
  }

  getJwtToken(): string {
    return localStorage.getItem(this.JWT_TOKEN_KEY);
  }

  setJwtToken(token: string) {
    localStorage.setItem(this.JWT_TOKEN_KEY, token);
  }

  removeJwtToken() {
    localStorage.removeItem(this.JWT_TOKEN_KEY);
  }
}
