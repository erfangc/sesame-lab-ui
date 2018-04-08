import {Document} from '../../corpus/Document';
import {UnsetCurrentDocument, UnsetCurrentDocumentAction} from './PutDocument';

export interface CorpusStore {
    currentDocument?: Document
}

const initialState: CorpusStore = {
    currentDocument: undefined,
};

type Actions = UnsetCurrentDocumentAction;

export function corpusReducer(state: CorpusStore = initialState, action: Actions): CorpusStore {
    switch (action.type) {
        case UnsetCurrentDocument:
            return {...state, currentDocument: undefined};
        default:
            return state;
    }
}