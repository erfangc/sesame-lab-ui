import {ReceiveCorpusDescriptors, ReceiveCorpusDescriptorsAction} from './ReceiveCorpusDescriptors';

export interface EntityConfig {
    displayName: string
    color: string
    textColor: string
}

export interface CorpusDescriptor {
    id: string
    title: string
    entityConfigs: { [type: string]: EntityConfig }
}

export type CorpusDescriptorStore = CorpusDescriptor[]
const initialState: CorpusDescriptor[] = [];

type Actions = ReceiveCorpusDescriptorsAction

export function corpusDescriptorReducer(state: CorpusDescriptorStore = initialState, action: Actions): CorpusDescriptorStore {
    switch (action.type) {
        case ReceiveCorpusDescriptors:
            return action.payload || [];
        default:
            return state;
    }
}