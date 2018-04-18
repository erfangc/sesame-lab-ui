import {createAction} from 'redux-actions';

type SetActiveCorpusID = 'SetActiveCorpusID';
export const SetActiveCorpusID: SetActiveCorpusID = 'SetActiveCorpusID';
export interface SetActiveCorpusIDAction {
    type: SetActiveCorpusID
    payload: string | undefined
}

export const setActiveCorpusID = createAction<string | undefined>(SetActiveCorpusID);
