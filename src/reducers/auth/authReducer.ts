import {AuthenticateAction, AuthenticateSuccess} from './AuthenticateSuccess';
import {Logout, LogoutAction} from './Logout';

export interface AuthStore {
    isAuthenticated: boolean
    expiresAt: any
    accessToken: string
    idToken: string // does this need to be in the store??
}

type AuthStoreActions = AuthenticateAction | LogoutAction;

/*
initial state for the AuthStore is always its we are NOT authenticated
 */
const initialState: AuthStore = {
    isAuthenticated: false,
    accessToken: '',
    expiresAt: 0,
    idToken: ''
};

export function authReducer(state: AuthStore = initialState, action: AuthStoreActions): AuthStore {
    switch (action.type) {
        case AuthenticateSuccess:
            return {...state, ...action.payload, isAuthenticated: true};
        case Logout:
            return initialState;
        default:
            return state;
    }
}