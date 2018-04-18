import {ClearError, ClearErrorAction} from './ClearError';
import {SetError, SetErrorAction} from './SetError';

export interface ErrorStore {
    message?: string
}

type Actions = ClearErrorAction | SetErrorAction
const initialState: ErrorStore = {};

export function errorReducer(state: ErrorStore = initialState, action: Actions): ErrorStore {
    switch (action.type) {
        case SetError:
            return {
                ...state,
                message: action.payload.message
            };
        case ClearError:
            return {
                ...state,
                message: undefined
            };
        default:
            return state;
    }
}