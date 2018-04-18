import {createAction} from 'redux-actions';
import {CorpusDescriptor} from './corpusReducer';

type ReceivedCorpus = 'ReceivedCorpus';
export const ReceivedCorpus: ReceivedCorpus = 'ReceivedCorpus';

export interface ReceivedCorpusAction {
    type: ReceivedCorpus
    payload: CorpusDescriptor
}

export const receivedCorpus = createAction<CorpusDescriptor>(ReceivedCorpus);