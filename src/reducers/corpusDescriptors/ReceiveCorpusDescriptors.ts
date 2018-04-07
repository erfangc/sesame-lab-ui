import {CorpusDescriptor} from './corpusDescriptorReducer';
import {Action, createAction} from 'redux-actions';

type ReceiveCorpusDescriptors = 'ReceiveCorpusDescriptors';
export const ReceiveCorpusDescriptors: ReceiveCorpusDescriptors = 'ReceiveCorpusDescriptors';

export interface ReceiveCorpusDescriptorsAction extends Action<CorpusDescriptor[]> {
    type: ReceiveCorpusDescriptors
}
export const receiveCorpusDescriptors = createAction<CorpusDescriptor[]>(ReceiveCorpusDescriptors);