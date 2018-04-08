import {Document} from '../../corpus/Document';

export interface CorpusStore {
    currentDocument?: Document
}

const initialState: CorpusStore = {
    currentDocument: undefined,
};

export function corpusReducer(state: CorpusStore = initialState, action: any): CorpusStore {
    switch (action.type) {
        default:
            return state;
    }
}