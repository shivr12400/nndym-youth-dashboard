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

export function loginUser(email, password) {
  return new Promise((resolve, reject) => {
      const authenticationData = { Username: email, Password: password };
      const authenticationDetails = new AuthenticationDetails(authenticationData);
      const userData = { Username: email, Pool: userPool };
      const cognitoUser = new CognitoUser(userData);

      cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: (result) => {
              const token = result.getIdToken().getJwtToken();

              if (typeof window !== 'undefined') {
                  // ROOT CAUSE FIX: Cognito stores session tokens internally using
                  // the sub/UUID as the key (e.g. "345814b8-9001-70a5-470b-..."),
                  // NOT the email address used to log in. If we save the email as
                  // the fallback username and later reconstruct:
                  //   new CognitoUser({ Username: email })
                  // then getSession() looks for:
                  //   CognitoIdentityServiceProvider.{ClientId}.{email}.idToken
                  // — which doesn't exist. Tokens are stored under the UUID, so
                  // the session lookup always fails and returns null.
                  //
                  // Fix: read the exact key Cognito wrote (the UUID) and save
                  // that as our fallback so reconstruction uses the right username.
                  const cognitoLastUser = localStorage.getItem(
                      `CognitoIdentityServiceProvider.${poolData.ClientId}.LastAuthUser`
                  );
                  localStorage.setItem('app_last_auth_user', cognitoLastUser);
              }

              resolve(token);
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

export function getSessionToken() {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') return resolve(null);

        let cognitoUser = userPool.getCurrentUser();

        if (!cognitoUser) {
            const lastUser = localStorage.getItem('app_last_auth_user');
            if (lastUser) {
                cognitoUser = new CognitoUser({ Username: lastUser, Pool: userPool });
            } else {
                console.warn("Auth Check: No user found in Cognito SDK storage or local fallback.");
                return resolve(null);
            }
        }

        cognitoUser.getSession((err, session) => {
            if (err || !session || !session.isValid()) {
                console.warn("Auth Check: Session invalid or expired.", err);
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('app_last_auth_user');
                }
                return resolve(null);
            }
            resolve(session.getIdToken().getJwtToken());
        });
    });
}

export async function verifyToken() {
  if (typeof window === 'undefined') return false;
  const token = await getSessionToken();
  return !!token;
}

export function logoutUser() {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) cognitoUser.signOut();
  if (typeof window !== 'undefined') {
      localStorage.removeItem('app_last_auth_user');
  }
}