import {createAction} from 'redux-actions';
import axios, {AxiosResponse} from 'axios';
import {call, put, takeLatest} from 'redux-saga/effects';
import {apiRoot} from '../../index';
import {CorpusDescriptor} from './corpusDescriptorReducer';
import {receivedCorpus} from './ReceivedCorpus';

type FetchCorpus = 'FetchCorpus';
export const FetchCorpus: FetchCorpus = 'FetchCorpus';

export interface FetchCorpusAction {
    type: FetchCorpus
    payload: string
}

export const fetchCorpus = createAction<string>(FetchCorpus);

function* runFetchCorpus(action: FetchCorpusAction) {
    const response: AxiosResponse<CorpusDescriptor> = yield call(axios.get, `${apiRoot}/api/v1/corpus/${action.payload}`);
    yield put(receivedCorpus(response.data));
}

export function* watchFetchCorpus() {
    yield takeLatest(FetchCorpus, runFetchCorpus);
}