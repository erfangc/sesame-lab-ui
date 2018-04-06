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

export function entityConfigReducer(state: EntityConfigStore = {}, action: UpdateEntityConfigAction): EntityConfigStore {
    switch (action.type) {
        case UpdateEntityConfig:
            return action.payload;
        default :
            return state;
    }
}