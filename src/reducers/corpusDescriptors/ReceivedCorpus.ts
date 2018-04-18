import {createAction} from 'redux-actions';
import {CorpusDescriptor} from './corpusDescriptorReducer';

type ReceivedCorpus = 'ReceivedCorpus';
export const ReceivedCorpus: ReceivedCorpus = 'ReceivedCorpus';

export interface ReceivedCorpusAction {
    type: ReceivedCorpus
    payload: CorpusDescriptor
}

export const receivedCorpus = createAction<CorpusDescriptor>(ReceivedCorpus);