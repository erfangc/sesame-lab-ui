import * as auth0 from 'auth0-js';
import {Auth0DecodedHash} from 'auth0-js';
import {history} from './History';
import axios from 'axios';

const AUTH_CONFIG = {
    domain: 'https://sesame-lab.auth0.com',
    clientId: 'tMAzRpskU72MYBo73Dx2YV3dr0jpQlj7',
    callbackUrl: 'http://localhost:3000/callback'
};

const auth0Instance = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    audience: AUTH_CONFIG.domain,
    responseType: 'token id_token',
    scope: 'openid profile email'
});


const setSession = (authResult: Auth0DecodedHash) => {
    /*
    Set the time that the access token will expire at
     */
    if (authResult.expiresIn == null || authResult.accessToken == null || authResult.idToken == null) {
        return;
    }
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    /*
    set axios default header to use the access_token
     */
    axios.defaults.headers['Authorization'] = `Bearer ${authResult.accessToken}`;
    history.push('/');
};

export const auth = {
    login: () => {
        auth0Instance.authorize();
    },
    handleAuthentication: () => {
        auth0Instance.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                console.log(authResult);
                setSession(authResult);
                history.push('/');
            } else if (err) {
                history.push('/');
                console.log(err);
                alert(`Error: ${err.error}. Check the console for further details.`);
            }
        });
    },
    logout: () => {
        /*
        clear access token and ID token from local storage
         */
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        /*
        navigate to the home route
         */
        delete axios.defaults.headers['Authorization'];
        history.push('/login');
    },
    isAuthenticated: () => {
        /*
        Check whether the current time is past the
        access token's expiry time
         */
        let item = localStorage.getItem('expires_at') || '0';
        let expiresAt = JSON.parse(item);
        return new Date().getTime() < expiresAt;
    }
};

