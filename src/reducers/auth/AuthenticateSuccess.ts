import {Action, createAction} from 'redux-actions';

type AuthenticateSuccess = 'AuthenticateSuccess'
export const AuthenticateSuccess: AuthenticateSuccess = 'AuthenticateSuccess';

interface AuthenticateSuccessPayload {
    expiresAt: any
    accessToken: string
    idToken: string
}

export const authenticateSuccess = createAction<AuthenticateSuccessPayload>(AuthenticateSuccess);

export interface AuthenticateAction extends Action<AuthenticateSuccessPayload> {
    type: AuthenticateSuccess
}