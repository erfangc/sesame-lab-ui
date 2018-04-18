import {createAction} from 'redux-actions';
import {EntityConfiguration} from './corpusReducer';
import axios, {AxiosResponse} from 'axios';
import {call, put, takeLatest} from 'redux-saga/effects';
import {apiRoot} from '../../index';
import {fetchCorpus} from './FetchCorpus';

type SaveEntityConfiguration = 'SaveEntityConfiguration';
const SaveEntityConfiguration: SaveEntityConfiguration = 'SaveEntityConfiguration';

interface SaveEntityConfigurationAction {
    type: SaveEntityConfiguration
    payload: EntityConfiguration
}

export const saveEntityConfiguration = createAction<EntityConfiguration>(SaveEntityConfiguration);

function* runSaveEntityConfiguration(action: SaveEntityConfigurationAction) {
    try {
        const response: AxiosResponse<EntityConfiguration> = yield call(axios.put, `${apiRoot}/api/v1/corpus/entity-configuration`, action.payload);
        yield put(fetchCorpus(response.data.corpusID));
    } catch (e) {
        // ignored, interceptor handles the work
    }
}

export function* watchSaveEntityConfiguration() {
    yield takeLatest(SaveEntityConfiguration, runSaveEntityConfiguration);
}