import {authReducer, AuthStore} from './auth/authReducer';
import {combineReducers, Reducer} from 'redux';
import {corpusReducer, CorpusStore} from './corpus/corpusReducer';
import {appReadyReducer} from './appReady';
import {DocumentStore, documentReducer} from './document/documentReducer';
import {modelsReducer, ModelsStore} from './models/modelsReducer';
import {errorReducer, ErrorStore} from './error/errorReducer';

export interface StoreState {
    documents: DocumentStore
    corpus: CorpusStore
    auth: AuthStore
    models: ModelsStore
    appReady: boolean
    error: ErrorStore
}

export const rootReducer: Reducer<StoreState> = combineReducers({
    documents: documentReducer,
    corpus: corpusReducer,
    auth: authReducer,
    models: modelsReducer,
    appReady: appReadyReducer,
    error: errorReducer
});
