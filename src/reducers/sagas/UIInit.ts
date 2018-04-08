import {call, put, takeLatest} from 'redux-saga/effects';
import axios, {AxiosResponse} from 'axios';
import {CorpusDescriptor} from '../corpusDescriptors/corpusDescriptorReducer';
import {createAction} from 'redux-actions';
import {receiveCorpusDescriptors} from '../corpusDescriptors/ReceiveCorpusDescriptors';
import {appReady} from '../appReady';
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
    yield put(appReady());
}

export function* watchUIInit() {
    yield takeLatest(UIInit, runUIInit);
}