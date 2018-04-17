import {Action, createAction} from 'redux-actions';
import axios, {AxiosResponse} from 'axios';
import {call, put, takeLatest} from 'redux-saga/effects';
import {apiRoot} from '../../index';
import {NERModel, NERModelWithCreatorInfo} from './modelsReducer';

type FetchModels = 'FetchModels';
const FetchModels: FetchModels = 'FetchModels';
interface FetchModelsAction {
    type: FetchModels
}
export const fetchModels = createAction(FetchModels);

type ReceivedModels = 'ReceivedModels';
export const ReceivedModels: ReceivedModels = 'ReceivedModels';
export interface ReceivedModelsAction extends Action<NERModelWithCreatorInfo[]>{
    type: ReceivedModels
}
const receivedModels = createAction<NERModelWithCreatorInfo[]>(ReceivedModels);

function* runFetchModels(action: FetchModelsAction) {
    const response: AxiosResponse<NERModelWithCreatorInfo[]> = yield call(axios.get, `${apiRoot}/api/v1/ner/all-models`);
    yield put(receivedModels(response.data));
}

export function* watchFetchModels() {
    yield takeLatest(FetchModels, runFetchModels);
}