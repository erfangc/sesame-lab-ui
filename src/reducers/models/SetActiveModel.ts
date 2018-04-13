import {Action, createAction} from 'redux-actions';

type SetActiveModel = 'SetActiveModel';
export const SetActiveModel:SetActiveModel ='SetActiveModel';
export interface SetActiveModelAction extends Action<string> {
    type: SetActiveModel
}

export const setActiveModel = createAction<string>(SetActiveModel);