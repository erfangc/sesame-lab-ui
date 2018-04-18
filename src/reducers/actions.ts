import {authenticateSuccess} from './auth/AuthenticateSuccess';
import {logout} from './auth/Logout';
import {receiveCorpusDescriptors} from './corpusDescriptors/ReceiveCorpusDescriptors';
import {appNotReady, appReady} from './appReady';
import {uiInit} from './sagas/UIInit';
import {putDocument} from './document/PutDocument';
import {setActiveDocument} from './document/SetActiveDocument';
import {trainModel} from './models/trainModel';
import {fetchModels} from './models/FetchModels';
import {deleteModel} from './models/DeleteModel';
import {setActiveModel} from './models/SetActiveModel';
import {deleteDocument} from './document/DeleteDocument';
import {receivedDocuments} from './document/ReceivedDocuments';
import {fetchDocuments} from './document/FetchDocuments';
import {updateUserProfile} from './auth/UpdateUserProfile';
import {saveCorpus} from './corpusDescriptors/SaveCorpus';
import {saveEntityConfiguration} from './corpusDescriptors/SaveEntityConfiguration';
import {setActiveCorpusID} from './corpusDescriptors/SetActiveCorpusID';
import {deleteCorpus} from './corpusDescriptors/DeleteCorpus';
import {fetchCorpus} from './corpusDescriptors/FetchCorpus';
import {deleteEntityConfiguration} from './corpusDescriptors/DeleteEntityConfiguration';

export const actions = {
    logout,
    trainModel,
    saveCorpus,
    saveEntityConfiguration,
    setActiveCorpusID,
    deleteCorpus,
    fetchCorpus,
    fetchModels,
    deleteEntityConfiguration,
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
    updateUserProfile,
    setActiveDocument
};

export type DispatchProps = typeof actions;