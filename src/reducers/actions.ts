import {authenticateSuccess} from './auth/AuthenticateSuccess';
import {logout} from './auth/Logout';
import {receiveCorpusDescriptors} from './corpusDescriptors/ReceiveCorpusDescriptors';
import {appNotReady, appReady} from './appReady';
import {uiInit} from './sagas/UIInit';
import {putDocument} from './corpus/PutDocument';
import {setActiveDocument} from './corpus/SetActiveDocument';
import {trainModel} from './trainModel';
import {fetchModels} from './models/FetchModels';
import {deleteModel} from './models/DeleteModel';

export const actions = {
    logout,
    trainModel,
    fetchModels,
    deleteModel,
    receiveCorpusDescriptors,
    authenticateSuccess,
    appReady,
    appNotReady,
    uiInit,
    putDocument,
    setActiveDocument
};

export type DispatchProps = typeof actions;