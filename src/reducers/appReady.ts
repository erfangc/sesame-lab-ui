import {createAction} from 'redux-actions';

type AppReady = 'AppReady';
const AppReady: AppReady = 'AppReady';
interface AppReadyAction {
    type: AppReady
}
export const setAppReady = createAction(AppReady);

type AppNotReady = 'AppNotReady';
const AppNotReady: AppNotReady = 'AppNotReady';
export const appNotReady = createAction(AppNotReady);
interface AppNotReadyAction {
    type: AppNotReady
}

type AppReadyActions = AppReadyAction | AppNotReadyAction

export function appReadyReducer(state: boolean = false, action: AppReadyActions) {
    switch (action.type) {
        case AppNotReady:
            return false;
        case AppReady:
            return true;
        default:
            return state;
    }
}
