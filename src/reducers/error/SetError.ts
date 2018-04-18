import {createAction} from 'redux-actions';

type SetError = 'SetError';
export const SetError: SetError = 'SetError';

export interface Payload {
    message: string
}

export interface SetErrorAction {
    type: SetError
    payload: Payload
}

export const setError = createAction<Payload>(SetError);