import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-1_aDocYS1v3',
  ClientId: 'ngpdk8b2fbasnackmmef3aojr'
};

const userPool = new CognitoUserPool(poolData);

const FALLBACK_USER_KEY = 'app_last_auth_user';

// getSession() may go to the network to refresh an expired token. If that
// request never settles (offline, captive portal, blocked host) the callback
// never fires — which is what left the app stuck on a spinner forever.
const SESSION_TIMEOUT_MS = 12000;

// Treat a token as expired slightly early so we never hand out one that dies
// mid-request.
const CLOCK_SKEW_MS = 60 * 1000;

/**
 * Module-level session cache.
 *
 * Every consumer (_app, NavBar, and each data hook) funnels through
 * resolveSession(), so a page load performs at most ONE Cognito getSession()
 * call instead of one per caller. Previously _app alone fired two concurrent
 * calls (verifyToken + getUserEmail), NavBar fired a third on every
 * navigation, and each hook fired another before every request — each one a
 * potential token-refresh round trip.
 */
let cachedSession = null;   // { token, email, expiresAt }
let inFlight = null;        // Promise shared by concurrent callers

function readStoredUsername() {
    if (typeof window === 'undefined') return null;
    const value = localStorage.getItem(FALLBACK_USER_KEY);
    // localStorage.setItem coerces null/undefined into the strings "null" /
    // "undefined". Reconstructing a CognitoUser from those sends us down the
    // slow failing-refresh path on every single load, so treat them as absent.
    if (!value || value === 'null' || value === 'undefined') return null;
    return value;
}

function cacheSession(session) {
    const idToken = session.getIdToken();
    cachedSession = {
        token: idToken.getJwtToken(),
        email: idToken.payload.email || null,
        expiresAt: idToken.getExpiration() * 1000,
    };
    return cachedSession;
}

function isFresh(session) {
    return !!session && session.expiresAt - CLOCK_SKEW_MS > Date.now();
}

function currentCognitoUser() {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) return cognitoUser;

    const lastUser = readStoredUsername();
    if (!lastUser) return null;

    // The Cognito SDK keys tokens by the user's sub/UUID, not their email, so
    // the fallback we stored at login is that UUID.
    return new CognitoUser({ Username: lastUser, Pool: userPool });
}

function loadSession() {
    return new Promise((resolve) => {
        const cognitoUser = currentCognitoUser();
        if (!cognitoUser) return resolve(null);

        let settled = false;
        const finish = (value) => {
            if (settled) return;
            settled = true;
            resolve(value);
        };

        const timer = setTimeout(() => {
            console.warn('Auth Check: session lookup timed out.');
            finish(null);
        }, SESSION_TIMEOUT_MS);

        cognitoUser.getSession((err, session) => {
            clearTimeout(timer);
            if (err || !session || !session.isValid()) {
                console.warn('Auth Check: session invalid or expired.', err);
                localStorage.removeItem(FALLBACK_USER_KEY);
                return finish(null);
            }
            finish(cacheSession(session));
        });
    });
}

/**
 * Resolves the current session, reusing the cached one when it is still valid
 * and sharing a single in-flight lookup between concurrent callers.
 * Always settles — never rejects, never hangs.
 */
export function resolveSession() {
    if (typeof window === 'undefined') return Promise.resolve(null);
    if (isFresh(cachedSession)) return Promise.resolve(cachedSession);
    if (inFlight) return inFlight;

    inFlight = loadSession().finally(() => { inFlight = null; });
    return inFlight;
}

/**
 * Synchronous answer to "could this browser possibly have a session?".
 *
 * Lets callers skip the async check entirely when nothing is stored locally —
 * a signed-out visitor gets the login form on the first paint instead of
 * staring at a spinner while we ask Cognito a question we already know the
 * answer to.
 */
export function hasStoredSession() {
    if (typeof window === 'undefined') return false;
    if (isFresh(cachedSession)) return true;
    return !!(userPool.getCurrentUser() || readStoredUsername());
}

function rememberUser() {
    if (typeof window === 'undefined') return;
    // ROOT CAUSE FIX: Cognito stores session tokens internally using the
    // sub/UUID as the key (e.g. "345814b8-9001-70a5-470b-..."), NOT the email
    // address used to log in. If we save the email as the fallback username
    // and later reconstruct:
    //   new CognitoUser({ Username: email })
    // then getSession() looks for:
    //   CognitoIdentityServiceProvider.{ClientId}.{email}.idToken
    // — which doesn't exist. Tokens are stored under the UUID, so the session
    // lookup always fails and returns null.
    const cognitoLastUser = localStorage.getItem(
        `CognitoIdentityServiceProvider.${poolData.ClientId}.LastAuthUser`
    );
    if (cognitoLastUser) localStorage.setItem(FALLBACK_USER_KEY, cognitoLastUser);
}

/**
 * Seeds the cache from a session we just received, so the callers that run
 * immediately after sign-in (the redirect, NavBar, the first data fetch) don't
 * each pay for another round trip.
 */
export function adoptSession(session) {
    rememberUser();
    return cacheSession(session);
}

export function loginUser(email, password) {
  return new Promise((resolve, reject) => {
      const authenticationData = { Username: email, Password: password };
      const authenticationDetails = new AuthenticationDetails(authenticationData);
      const userData = { Username: email, Pool: userPool };
      const cognitoUser = new CognitoUser(userData);

      cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: (result) => {
              const { token, email: resolvedEmail } = adoptSession(result);
              resolve({ token, email: resolvedEmail });
          },
          onFailure: (err) => reject(err),
          newPasswordRequired: (_userAttributes, _requiredAttributes) => {
              reject({
                  code: 'NewPasswordRequired',
                  cognitoUser,
                  message: 'You must set a new password before signing in.'
              });
          }
      });
  });
}

export async function getSessionToken() {
    const session = await resolveSession();
    return session ? session.token : null;
}

export async function getUserEmail() {
    const session = await resolveSession();
    return session ? session.email : null;
}

export async function verifyToken() {
    return !!(await resolveSession());
}

export function logoutUser() {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) cognitoUser.signOut();
  cachedSession = null;
  inFlight = null;
  if (typeof window !== 'undefined') {
      localStorage.removeItem(FALLBACK_USER_KEY);
  }
}
