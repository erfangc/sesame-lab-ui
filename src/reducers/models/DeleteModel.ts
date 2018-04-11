import {Action, createAction} from 'redux-actions';
import {call, put, takeLatest} from 'redux-saga/effects';
import axios from 'axios';
import {apiRoot} from '../../index';
import {fetchModels} from './FetchModels';

type DeleteModel = 'DeleteModel';
const DeleteModel: DeleteModel = 'DeleteModel';

interface DeleteModelPayload {
    modelID: string
    onComplete?: () => void
}

interface DeleteModelAction extends Action<DeleteModelPayload> {
    type: DeleteModel
}

export const deleteModel = createAction<DeleteModelPayload>(DeleteModel);

function* runDeleteModel(action: DeleteModelAction) {
    if (action.payload !== undefined) {
        yield call(axios.delete, `${apiRoot}/api/v1/ner/${action.payload.modelID}`);
        if (action.payload.onComplete !== undefined) {
            action.payload.onComplete();
        }
        /*
        re-fetch
         */
        yield put(fetchModels());
    }
}

export function* watchDeleteModel() {
    yield takeLatest(DeleteModel, runDeleteModel);
}