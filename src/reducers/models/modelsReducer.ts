import {ReceivedModels, ReceivedModelsAction} from './FetchModels';

export interface NERModel {
    modelID: string
    modelName: string
    modelDescription: string
    createdBy: string
    createdOn: string
    createdByEmail: string
    fileLocation: string
}

export interface ModelsStore {
    models: NERModel[]
}

type Actions = ReceivedModelsAction

const initialState: ModelsStore = {
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
        default:
            return state;
    }
}