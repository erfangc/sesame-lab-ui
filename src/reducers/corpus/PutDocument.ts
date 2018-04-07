import {createAction} from 'redux-actions';
import {call, put, takeLatest} from 'redux-saga/effects';
import axios from 'axios';

type PutDocument = 'PutDocument';
const PutDocument: PutDocument = 'PutDocument';

interface Payload {
    Id?: string
    Content: string
    Corpus: string
}

interface PutDocumentAction {
    type: PutDocument
    payload: Payload
}

export const putDocument = createAction<Payload>(PutDocument);

type UnsetCurrentDocument = 'UnsetCurrentDocument';
export const UnsetCurrentDocument: UnsetCurrentDocument = 'UnsetCurrentDocument';
const unsetCurrentDocument = createAction(UnsetCurrentDocument);

export interface UnsetCurrentDocumentAction {
    type: UnsetCurrentDocument
}

function* runPutDocument({payload: {Corpus, Content}}: PutDocumentAction) {
    yield call(axios.post, `http://127.0.0.1:8080/api/v1/corpus/${Corpus}/`, {body: Content});
    /*
    reset the current document
     */
    yield put(unsetCurrentDocument());
}

export function* watchPutDocument() {
    yield takeLatest(PutDocument, runPutDocument);
}