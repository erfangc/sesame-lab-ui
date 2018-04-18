import {call, put, takeLatest} from 'redux-saga/effects';
import axios, {AxiosResponse} from 'axios';
import {CorpusDescriptor} from '../corpus/corpusReducer';
import {createAction} from 'redux-actions';
import {receiveCorpusDescriptors} from '../corpus/ReceiveCorpusDescriptors';
import {setAppReady} from '../appReady';
import {apiRoot} from '../..';

type UIInit = 'UIInit';
const UIInit: UIInit = 'UIInit';
export const uiInit = createAction(UIInit);

/**
 * init saga to bootstrap application & store
 * @returns {IterableIterator<any>}
 */
interface UIConfiguration {
    corpusDescriptors: CorpusDescriptor[]
}

function* runUIInit() {
    const {data: {corpusDescriptors}}: AxiosResponse<UIConfiguration> = yield call(axios.get, `${apiRoot}/api/v1/ui-config`);
    yield put(receiveCorpusDescriptors(corpusDescriptors));
    yield put(setAppReady());
}

export function* watchUIInit() {
    yield takeLatest(UIInit, runUIInit);
}