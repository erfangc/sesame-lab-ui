import {authReducer, AuthStore} from './auth/authReducer';
import {combineReducers, Reducer} from 'redux';
import {corpusDescriptorReducer, CorpusDescriptorStore} from './corpusDescriptors/corpusDescriptorReducer';
import {appReadyReducer} from './appReady';
import {corpusReducer, CorpusStore} from './corpus/corpusReducer';
import {modelsReducer, ModelsStore} from './models/modelsReducer';

export interface StoreState {
    corpus: CorpusStore
    corpusDescriptors: CorpusDescriptorStore
    auth: AuthStore
    models: ModelsStore
    appReady: boolean
}

export const rootReducer: Reducer<StoreState> = combineReducers({
    corpus: corpusReducer,
    corpusDescriptors: corpusDescriptorReducer,
    auth: authReducer,
    models: modelsReducer,
    appReady: appReadyReducer
});
