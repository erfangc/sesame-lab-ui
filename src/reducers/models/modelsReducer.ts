import {ReceivedModels, ReceivedModelsAction} from './FetchModels';
import {SetActiveModel, SetActiveModelAction} from './SetActiveModel';

export interface NERModel {
    modelID: string
    modelName: string
    modelDescription: string
    createdBy: string
    createdOn: string
    createdByEmail: string
    fileLocation: string
    corpus: string
}

export interface ModelsStore {
    activeModel?: string
    models: NERModel[]
}

type Actions = ReceivedModelsAction | SetActiveModelAction;

const initialState: ModelsStore = {
    activeModel: undefined,
    models: []
};

export function modelsReducer(state: ModelsStore = initialState, action: Actions): ModelsStore {
    switch (action.type) {
        case ReceivedModels:
            if (action.payload !== undefined) {
                return {
                    ...state,
                    models: action.payload
                };
            } else {
                return state;
            }
        case SetActiveModel:
            return {
                ...state,
                activeModel: action.payload
            };
        default:
            return state;
    }
}