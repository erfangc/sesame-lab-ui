import {authenticateSuccess} from './auth/AuthenticateSuccess';
import {logout} from './auth/Logout';
import {receiveCorpusDescriptors} from './corpusDescriptors/ReceiveCorpusDescriptors';
import {appNotReady, appReady} from './appReady';
import {uiInit} from './sagas/UIInit';
import {putDocument} from './corpus/PutDocument';

export const actions = {
    logout,
    receiveCorpusDescriptors,
    authenticateSuccess,
    appReady,
    appNotReady,
    uiInit,
    putDocument
};

export type DispatchProps = typeof actions;