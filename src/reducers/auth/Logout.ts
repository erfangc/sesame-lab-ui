import {Action} from 'redux-actions';
import {Dispatch} from 'redux';
import {auth0Handler} from './auth0/Auth0Handler';

type Logout = 'Logout';
export const Logout: Logout = 'Logout';

export interface LogoutAction extends Action<{}> {
    type: Logout
}

export const logout = () => (dispatch: Dispatch<any>) => {
    auth0Handler.logout();
    dispatch({
        type: Logout,
    });
};