import {createAction} from 'redux-actions';
import {call, takeLatest} from 'redux-saga/effects';
import axios, {AxiosResponse} from 'axios';
import {apiRoot} from '../..';

type PutDocument = 'PutDocument';
const PutDocument: PutDocument = 'PutDocument';

interface Payload {
    Id?: string
    Content: string
    Corpus: string
    onComplete?: (id: string) => void
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

function* runPutDocument({payload: {Id, Corpus, Content, onComplete}}: PutDocumentAction) {
    const {data}: AxiosResponse<string> = yield call(axios.post, `${apiRoot}/api/v1/corpus/${Corpus}/?${!!Id ? `id=${Id}` : ''}`, {body: Content});
    if (onComplete !== undefined) {
        onComplete(data);
    }
}

export function* watchPutDocument() {
    yield takeLatest(PutDocument, runPutDocument);
}