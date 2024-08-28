/* ============================================================================
 * Ericsson Data Science Lounge Frontend
 *
 * loginError.ts - this is the type of object we expect to be returned by the
 *  backend if there is an error
 * ============================================================================
 */
export class LoginError {
  response: string;
  userFriendlyError: string;
}
