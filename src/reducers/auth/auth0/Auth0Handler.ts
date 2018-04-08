import * as auth0 from 'auth0-js';
import {Auth0DecodedHash} from 'auth0-js';
import {history} from '../../../History';
import {store} from '../../../index';
import {authenticateSuccess} from '../AuthenticateSuccess';
import {uiInit} from '../../sagas/UIInit';

export const AUTH_CONFIG = {
    domain: process.env.REACT_APP_DOMAIN as string,
    clientId: process.env.REACT_APP_CLIENTID as string,
    callbackUrl: process.env.REACT_APP_CALLBACKURL as string,
    audience: process.env.REACT_APP_AUDIENCE as string
};

const auth0Instance = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    audience: AUTH_CONFIG.audience,
    responseType: 'token id_token',
    scope: 'openid profile email'
});

/*
whenever the App loads, we could be in 1 or 3 situations
1 - we have just successfully authenticated: the app is loaded by the authorization provider via redirect with the tokens in the URL
2 - we were previous successfully authenticated: localStorage has an valid and non-expiring access_token / id_token
3 - we are not authenticated at all (i.e. no authorization code in the URL and nothing (or invalid / expired) in localStorage
 */
function initAuth() {
    if (history.location.pathname === '/callback') {
        auth0Instance.parseHash((err, authResult) => {
            if (err) {
                console.error(err);
            } else if (authResult && authResult.accessToken && authResult.idToken) {
                setLocalStorage(authResult);
                store.dispatch(authenticateSuccess({
                    accessToken: authResult.accessToken,
                    expiresAt: authResult.expiresIn,
                    idToken: authResult.idToken
                }));
                store.dispatch(uiInit());
                history.push('/');
            }
        });
    } else if (isAuthenticated()) {
        // using setTimeout as the store may not be initialized yet
        setTimeout(() => {
            const accessToken = localStorage.getItem('access_token');
            const idToken = localStorage.getItem('id_token');
            const expiresAt = localStorage.getItem('expires_at');
            if (accessToken && idToken && expiresAt) {
                store.dispatch(authenticateSuccess({
                    accessToken: accessToken,
                    expiresAt: expiresAt,
                    idToken: idToken
                }));
            }
            store.dispatch(uiInit());
        });
    }
}

initAuth();

/**
 * this authentication method should only be used on app start up / refresh
 * since it uses localStorage instead of the redux store
 *
 * the idea is to rely on the redux store for the current active session, localStorage is a mechanism we use
 * to persist states between active sessions of the app
 * @returns {boolean}
 */
function isAuthenticated() {
    /*
    check whether the current time is past the
    access token's expiry time
     */
    let item = localStorage.getItem('expires_at') || '0';
    let expiresAt = JSON.parse(item);
    return new Date().getTime() < expiresAt;
}

function setLocalStorage({idToken, expiresIn, accessToken}: Auth0DecodedHash) {
    /*
    set the time that the access token will expire at
     */
    if (expiresIn == null || accessToken == null || idToken == null) {
        return;
    }
    let expiresAt = JSON.stringify((expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('id_token', idToken);
    localStorage.setItem('expires_at', expiresAt);
    return {
        accessToken: accessToken,
        idToken: idToken,
        expiresAt: expiresIn
    };
}

export const auth0Handler = {
    login: () => {
        auth0Instance.authorize();
    },
    logout: () => {
        /*
        clear access token and ID token from local storage
         */
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        history.push('/');
    }
};
