type UpdateEntityConfig = 'UpdateEntityConfig'
const UpdateEntityConfig: UpdateEntityConfig = 'UpdateEntityConfig';

export interface EntityConfig {
    displayName: string
    color: string
    textColor: string
}

interface UpdateEntityConfigAction {
    type: UpdateEntityConfig
    payload: { [type: string]: EntityConfig }
}

export interface EntityConfigStore {
    [type: string]: EntityConfig
}

const initialState: EntityConfigStore = {
    firm: {color: '#E27D60', textColor: '#333', displayName: 'Management Firm'},
    family: {color: '#659DBD', textColor: '#f4f4f4', displayName: 'Fund Family'},
    unknown: {color: '#666', textColor: '#fff', displayName: 'Unknown'}
};

export function entityConfigReducer(state: EntityConfigStore = initialState, action: UpdateEntityConfigAction): EntityConfigStore {
    switch (action.type) {
        case UpdateEntityConfig:
            return action.payload;
        default :
            return state;
    }
}
