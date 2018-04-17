import {ReceivedModels, ReceivedModelsAction} from './FetchModels';
import {SetActiveModel, SetActiveModelAction} from './SetActiveModel';

export interface NERModelWithCreatorInfo {
    model: NERModel
    user?: {
        email: string
        nickname: string
        id: string
    }
}

export interface NERModel {
    id: string,
    name: string,
    description: string,
    userID: string,
    createdOn: string,
    fileLocation: string,
    corpusID: string
}

export interface ModelsStore {
    activeModel?: string
    models: NERModelWithCreatorInfo[]
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