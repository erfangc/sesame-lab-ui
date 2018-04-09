import {createAction} from 'redux-actions';
import {call, takeLatest} from 'redux-saga/effects';
import axios, {AxiosResponse} from 'axios';
import {apiRoot} from '../..';

type PutDocument = 'PutDocument';
const PutDocument: PutDocument = 'PutDocument';

interface Payload {
    id?: string
    content: string
    corpus: string
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

function* runPutDocument({payload: {id, corpus, content, onComplete}}: PutDocumentAction) {
    const {data}: AxiosResponse<string> = yield call(axios.post, `${apiRoot}/api/v1/corpus/${corpus}/?${!!id ? `id=${id}` : ''}`, {body: content});
    if (onComplete !== undefined) {
        onComplete(data);
    }
}

export function* watchPutDocument() {
    yield takeLatest(PutDocument, runPutDocument);
}