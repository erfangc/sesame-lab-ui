import {Document} from '../../document/Document';
import {SetActiveDocument, SetActiveDocumentAction} from './SetActiveDocument';
import {ReceivedDocuments, ReceivedDocumentsAction} from './ReceivedDocuments';

export interface DocumentStore {
    activeDocument?: Document
    documents: Document[]
}

const initialState: DocumentStore = {
    activeDocument: undefined,
    documents: []
};
type Actions = SetActiveDocumentAction | ReceivedDocumentsAction;

export function documentReducer(state: DocumentStore = initialState, action: Actions): DocumentStore {
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