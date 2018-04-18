import {Action, createAction} from 'redux-actions';
import {call, put, takeLatest} from 'redux-saga/effects';
import axios, {AxiosResponse} from 'axios';
import {apiRoot} from '../../index';
import {Document} from '../../corpus/Document';
import {receivedDocuments} from './ReceivedDocuments';

type FetchDocuments = 'FetchDocuments';
const FetchDocuments: FetchDocuments = 'FetchDocuments';

interface Payload {
    corpusID: string
}

interface FetchDocumentsAction extends Action<Payload> {
    type: FetchDocuments
}

export const fetchDocuments = createAction<Payload>(FetchDocuments);

function* runFetchDocuments(action: FetchDocumentsAction) {
    const {payload} = action;
    if (payload !== undefined) {
        const {corpusID} = payload;
        const response: AxiosResponse<Document[]> = yield call(axios.get, `${apiRoot}/api/v1/document/by-creator`, {params: {corpusID}});
        yield put(receivedDocuments({documents: response.data}));
    }
}

export function* watchFetchDocuments() {
    yield takeLatest(FetchDocuments, runFetchDocuments);
}