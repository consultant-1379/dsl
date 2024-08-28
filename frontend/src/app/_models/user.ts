export class User {
  _id: string; // the user's signum
  _rev: string;
  type: string;
  displayName: string; // the user's full name e.g. Joe Bloggs
  email: string;
  modified: Date;
  visits: number;
}
