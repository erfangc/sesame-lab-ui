import {Action, createAction} from 'redux-actions';
import axios, {AxiosResponse} from 'axios';
import {call, put, takeLatest} from 'redux-saga/effects';
import {apiRoot} from '../../index';
import {NERModel} from './modelsReducer';

type FetchModels = 'FetchModels';
const FetchModels: FetchModels = 'FetchModels';
interface FetchModelsAction {
    type: FetchModels
}
export const fetchModels = createAction(FetchModels);

type ReceivedModels = 'ReceivedModels';
export const ReceivedModels: ReceivedModels = 'ReceivedModels';
export interface ReceivedModelsAction extends Action<NERModel[]>{
    type: ReceivedModels
}
const receivedModels = createAction<NERModel[]>(ReceivedModels);

function* runFetchModels(action: FetchModelsAction) {
    const response: AxiosResponse<NERModel[]> = yield call(axios.get, `${apiRoot}/api/v1/ner/all-models`);
    yield put(receivedModels(response.data));
}

export function* watchFetchModels() {
    yield takeLatest(FetchModels, runFetchModels);
}