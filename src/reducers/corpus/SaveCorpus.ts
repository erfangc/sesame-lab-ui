import {createAction} from 'redux-actions';
import {call, put, takeLatest} from 'redux-saga/effects';
import axios, {AxiosResponse} from 'axios';
import {apiRoot} from '../../index';
import {fetchCorpus} from './FetchCorpus';

type SaveCorpus = 'SaveCorpus';
export const SaveCorpus: SaveCorpus = 'SaveCorpus';

export interface Corpus {
    id: string
    title: string
    userID: string
}

export interface SaveCorpusAction {
    type: SaveCorpus
    payload: Corpus
}

export const saveCorpus = createAction<Corpus>(SaveCorpus);

function* runSaveCorpus(action: SaveCorpusAction) {
    try {
        /*
        run XHR to persist on server
        */
        const response: AxiosResponse<Corpus> = yield call(axios.put, `${apiRoot}/api/v1/corpus`, action.payload);
        /*
        update the store
         */
        yield put(fetchCorpus(response.data.id));
    } catch (e) {
        // ignored, interceptor handles the work
    }
}

export function* watchSaveCorpus() {
    yield takeLatest(SaveCorpus, runSaveCorpus);
}