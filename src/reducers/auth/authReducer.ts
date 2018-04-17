import {AuthenticateAction, AuthenticateSuccess} from './AuthenticateSuccess';
import {Logout, LogoutAction} from './Logout';
import {UpdateUserProfile, UpdateUserProfileAction} from './UpdateUserProfile';

export interface AuthStore {
    isAuthenticated: boolean
    expiresAt: any
    accessToken: string
    idToken: string // does this need to be in the store??
    userProfile?: UserProfile
}

type AuthStoreActions = AuthenticateAction | LogoutAction | UpdateUserProfileAction;

/*
initial state for the AuthStore is always its we are NOT authenticated
 */
const initialState: AuthStore = {
    isAuthenticated: false,
    accessToken: '',
    expiresAt: 0,
    idToken: ''
};

/**
 * we declare our own user profile object
 * as we do not wish to tie ourselves to the auth0 object
 * in case that shape changes or we switch provider
 */
export interface UserProfile {
    id: string // this is the user id
    email: string
    nickname: string
}

export function authReducer(state: AuthStore = initialState, action: AuthStoreActions): AuthStore {
    switch (action.type) {
        case AuthenticateSuccess:
            return {...state, ...action.payload, isAuthenticated: true};
        case Logout:
            return initialState;
        case UpdateUserProfile:
            return {
                ...state,
                userProfile: action.payload
            };
        default:
            return state;
    }
}