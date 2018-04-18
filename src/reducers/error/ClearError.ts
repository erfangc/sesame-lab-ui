import {createAction} from 'redux-actions';

type ClearError = 'ClearError';
export const ClearError: ClearError = 'ClearError';

export interface ClearErrorAction {
    type: ClearError
}

export const clearError = createAction(ClearError);