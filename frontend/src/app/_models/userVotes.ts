/* ============================================================================
 * Ericsson Data Science Lounge Frontend
 *
 * userVotes.ts - This class contains an array of all the upvotes that a
 *  user has given for any projects in DSL.
 * ============================================================================
 */
import { Vote } from './vote';

export class UserVotes {
  _id: string;
  type = 'userVotes';
  userId = '';
  votes: Vote[] = [];
}
