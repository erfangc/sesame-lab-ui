import {Document} from '../../document/Document';
import {Action, createAction} from 'redux-actions';

type ReceivedDocuments = 'ReceivedDocuments';
export const ReceivedDocuments: ReceivedDocuments = 'ReceivedDocuments';
interface Payload {
    documents: Document[]
}
export interface ReceivedDocumentsAction extends Action<Payload> {
    type: ReceivedDocuments
}

export const receivedDocuments = createAction<Payload>(ReceivedDocuments);