import {Action, createAction} from 'redux-actions';
import {call, put, takeEvery} from 'redux-saga/effects';
import axios from 'axios';
import {apiRoot} from '../../index';
import {fetchDocuments} from './FetchDocuments';

type DeleteDocument = 'DeleteDocument';
const DeleteDocument: DeleteDocument = 'DeleteDocument';
interface Payload {
    id: string
    corpusID: string
}
export interface DeleteDocumentAction extends Action<Payload> {
    type: DeleteDocument
}

export const deleteDocument = createAction<Payload>(DeleteDocument);

function* runDeleteDocument(action: DeleteDocumentAction) {
    const {payload} = action;
    if (payload !==undefined) {
        const {corpusID, id} = payload;
        yield call(axios.delete, `${apiRoot}/api/v1/document/${id}`, {params:{corpusID}});
        yield put(fetchDocuments({corpusID}));
    }
}

export function* watchDeleteDocument() {
    yield takeEvery(DeleteDocument, runDeleteDocument);
}