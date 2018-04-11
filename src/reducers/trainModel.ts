import {Action, createAction} from 'redux-actions';
import {call, takeLatest} from 'redux-saga/effects';
import axios from 'axios';
import {apiRoot} from '../index';

type TrainModel = 'TrainModel';
const TrainModel: TrainModel = 'TrainModel';

interface TrainModelPayload {
    modelName: string
    corpus: string
    modelDescription?: string
    modifiedAfter?: number
    onComplete?: () => void
}

interface TrainModelAction extends Action<TrainModelPayload> {
    type: TrainModel
}

export const trainModel = createAction<TrainModelPayload>(TrainModel);

function* runTrainModel(action: TrainModelAction) {
    const {payload} = action;
    if (payload !== undefined) {
        yield call(
            axios.post,
            `${apiRoot}/api/v1/ner/train`,
            null,
            {
                params: {
                    modelName: payload.modelName,
                    modelDescription: payload.modelDescription,
                    corpus: payload.corpus,
                    modifiedAfter: payload.modifiedAfter
                }
            }
        );
        if (payload.onComplete !== undefined) {
            payload.onComplete();
        }
    }
}

export function* watchTrainModel() {
    yield takeLatest(TrainModel, runTrainModel);
}