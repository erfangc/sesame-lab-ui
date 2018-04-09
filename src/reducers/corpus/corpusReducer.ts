import {Document} from '../../corpus/Document';
import {SetActiveDocument, SetActiveDocumentAction} from './SetActiveDocument';

export interface CorpusStore {
    activeDocument?: Document
}

const initialState: CorpusStore = {
    activeDocument: undefined
};
type Actions = SetActiveDocumentAction;
export function corpusReducer(state: CorpusStore = initialState, action: Actions): CorpusStore {
    switch (action.type) {
        case SetActiveDocument:
            return {...state, activeDocument: action.payload};
        default:
            return state;
    }
}