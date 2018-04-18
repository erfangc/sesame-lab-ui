import {createAction} from 'redux-actions';
import {call, put, select, takeLatest} from 'redux-saga/effects';
import axios, {AxiosResponse} from 'axios';
import {apiRoot} from '../../index';
import {Corpus} from './SaveCorpus';
import {StoreState} from '../index';
import {guid} from '../../utils/AppUtils';
import {fetchCorpus} from './FetchCorpus';
import {history} from '../../History';

type NewCorpus = 'NewCorpus';
export const NewCorpus: NewCorpus = 'NewCorpus';

export interface NewCorpusAction {
    type: NewCorpus
}

export const newCorpus = createAction(NewCorpus);

function* runNewCorpus(action: NewCorpusAction) {
    const {auth: {userProfile}}: StoreState = yield select();
    if (!userProfile) {
        return;
    }
    const corpus: Corpus = {
        id: guid(),
        title: 'New Corpus',
        userID: userProfile.id
    };
    const response: AxiosResponse<Corpus> = yield call(axios.put, `${apiRoot}/api/v1/corpus`, corpus);
    yield put(fetchCorpus(response.data.id));
}

export function* watchNewCorpus() {
    yield takeLatest(NewCorpus, runNewCorpus);
}