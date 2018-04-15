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
import {setActiveModel} from './models/SetActiveModel';
import {deleteDocument} from './corpus/DeleteDocument';
import {receivedDocuments} from './corpus/ReceivedDocuments';
import {fetchDocuments} from './corpus/FetchDocuments';

export const actions = {
    logout,
    trainModel,
    fetchModels,
    deleteModel,
    fetchDocuments,
    setActiveModel,
    deleteDocument,
    receivedDocuments,
    receiveCorpusDescriptors,
    authenticateSuccess,
    appReady,
    appNotReady,
    uiInit,
    putDocument,
    setActiveDocument
};

export type DispatchProps = typeof actions;