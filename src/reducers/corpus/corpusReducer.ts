import {Document} from '../../corpus/Document';
import {SetActiveDocument, SetActiveDocumentAction} from './SetActiveDocument';
import {ReceivedDocuments, ReceivedDocumentsAction} from './ReceivedDocuments';

export interface CorpusStore {
    activeDocument?: Document
    documents: Document[]
}

const initialState: CorpusStore = {
    activeDocument: undefined,
    documents: []
};
type Actions = SetActiveDocumentAction | ReceivedDocumentsAction;

export function corpusReducer(state: CorpusStore = initialState, action: Actions): CorpusStore {
    switch (action.type) {
        case SetActiveDocument:
            return {...state, activeDocument: action.payload};
        case ReceivedDocuments:
            if (action.payload) {
                return {
                    ...state, documents: action.payload.documents
                };
            } else {
                return state;
            }
        default:
            return state;
    }
}