import {authReducer, AuthStore} from './auth/authReducer';
import {combineReducers, Reducer} from 'redux';
import {corpusDescriptorReducer, CorpusDescriptorStore} from './corpusDescriptors/corpusDescriptorReducer';
import {appReadyReducer} from './appReady';
import {corpusReducer, CorpusStore} from './corpus/corpusReducer';

export interface StoreState {
    corpus: CorpusStore
    corpusDescriptors: CorpusDescriptorStore
    auth: AuthStore
    appReady: boolean
}

export const rootReducer: Reducer<StoreState> = combineReducers({
    corpus: corpusReducer,
    corpusDescriptors: corpusDescriptorReducer,
    auth: authReducer,
    appReady: appReadyReducer
});
