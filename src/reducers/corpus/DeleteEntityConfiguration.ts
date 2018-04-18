import {createAction} from 'redux-actions';
import {call, put, takeLatest} from 'redux-saga/effects';
import axios from 'axios';
import {apiRoot} from '../../index';
import {fetchCorpus} from './FetchCorpus';

type DeleteEntityConfiguration = 'DeleteEntityConfiguration';
export const DeleteEntityConfiguration: DeleteEntityConfiguration = 'DeleteEntityConfiguration';
interface Payload {
    corpusID: string
    entityConfigurationID: string
}
export interface DeleteEntityConfigurationAction {
    type: DeleteEntityConfiguration
    payload: Payload
}

export const deleteEntityConfiguration = createAction<Payload>(DeleteEntityConfiguration);

function* runDeleteEntityConfiguration(action: DeleteEntityConfigurationAction) {
    const {entityConfigurationID, corpusID} = action.payload;
    yield call(axios.delete, `${apiRoot}/api/v1/corpus/entity-configuration/${entityConfigurationID}`);
    yield put(fetchCorpus(corpusID));
}

export function* watchDeleteEntityConfiguration() {
    yield takeLatest(DeleteEntityConfiguration, runDeleteEntityConfiguration);
}