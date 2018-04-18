import {ReceiveCorpusDescriptors, ReceiveCorpusDescriptorsAction} from './ReceiveCorpusDescriptors';
import {SetActiveCorpusID, SetActiveCorpusIDAction} from './SetActiveCorpusID';
import {ReceivedCorpus, ReceivedCorpusAction} from './ReceivedCorpus';
import {DeleteCorpus, DeleteCorpusAction} from './DeleteCorpus';

export interface EntityConfiguration {
    id: string
    type: string
    displayName: string
    color: string
    textColor: string
    corpusID: string
}

export interface CorpusDescriptor {
    id: string
    title: string
    userID: string
    entityConfigs: { [type: string]: EntityConfiguration }
}

export type CorpusDescriptorStore = {
    activeCorpusID?: string
    corpusDescriptors: CorpusDescriptor[]
}
const initialState: CorpusDescriptorStore = {corpusDescriptors: []};

type Actions = ReceiveCorpusDescriptorsAction | SetActiveCorpusIDAction | ReceivedCorpusAction | DeleteCorpusAction

export function corpusDescriptorReducer(state: CorpusDescriptorStore = initialState, action: Actions): CorpusDescriptorStore {
    switch (action.type) {
        case ReceiveCorpusDescriptors:
            return {
                ...state,
                corpusDescriptors: action.payload || []
            };
        case SetActiveCorpusID:
            return {
                ...state,
                activeCorpusID: action.payload
            };
        case DeleteCorpus:
            return {
                ...state,
                corpusDescriptors: state.corpusDescriptors.filter(({id}) => id !== action.payload)
            };
        case ReceivedCorpus:
            let corpusDescriptors;
            if (state.corpusDescriptors.find(({id}) => id === action.payload.id)) {
                corpusDescriptors = state.corpusDescriptors.map((corpusDescriptor) => {
                    if (corpusDescriptor.id === action.payload.id) {
                        return action.payload;
                    } else {
                        return corpusDescriptor;
                    }
                })
            } else {
                corpusDescriptors = [...state.corpusDescriptors, action.payload];
            }
            return {
                ...state,
                activeCorpusID: action.payload.id,
                corpusDescriptors: corpusDescriptors
            };
        default:
            return state;
    }
}