import {createAction} from 'redux-actions';
import axios from 'axios';
import {call, takeLatest} from 'redux-saga/effects';
import {apiRoot} from '../../index';

type DeleteCorpus = 'DeleteCorpus';
export const DeleteCorpus: DeleteCorpus = 'DeleteCorpus';

export interface DeleteCorpusAction {
    type: DeleteCorpus
    payload: string
}

export const deleteCorpus = createAction<string>(DeleteCorpus);

function* runDeleteCorpus(action: DeleteCorpusAction) {
    yield call(axios.delete, `${apiRoot}/api/v1/corpus/${action.payload}`);
}

export function* watchDeleteCorpus() {
    yield takeLatest(DeleteCorpus, runDeleteCorpus);
}