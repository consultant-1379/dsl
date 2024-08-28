/* ============================================================================
 * Ericsson Data Science Lounge Frontend
 *
 * loginResult.ts - this is the type of object we expect to be returned by the
 *  backend when we successfully log in
 * ============================================================================
 */
import { User } from '../../../_models/user';

export class LoginResult {
  user: User;
  token: string; // JWT Token
}
