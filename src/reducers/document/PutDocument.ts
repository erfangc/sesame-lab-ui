import {createAction} from 'redux-actions';
import {call, put, takeLatest} from 'redux-saga/effects';
import axios, {AxiosResponse} from 'axios';
import {apiRoot} from '../..';
import {fetchDocuments} from './FetchDocuments';
import {Document} from '../../document/Document';

type PutDocument = 'PutDocument';
const PutDocument: PutDocument = 'PutDocument';

interface Payload {
    document: Document
    onComplete?: (id: string) => void
}

interface PutDocumentAction {
    type: PutDocument
    payload: Payload
}

/**
 * triggers the generator to upload an tagged document to the server
 * @type {ActionFunction1<any, Action<any>>}
 */
export const putDocument = createAction<Payload>(PutDocument);

function* runPutDocument({payload: {document, onComplete}}: PutDocumentAction) {
    const {data}: AxiosResponse<string> = yield call(axios.post, `${apiRoot}/api/v1/document`, document);
    if (onComplete !== undefined) {
        onComplete(data);
    }
    yield put(fetchDocuments({corpusID: document.corpus}));
}

export function* watchPutDocument() {
    yield takeLatest(PutDocument, runPutDocument);
}