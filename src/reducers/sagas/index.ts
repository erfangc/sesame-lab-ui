import {all} from 'redux-saga/effects';
import {watchUIInit} from './UIInit';
import {watchPutDocument} from '../corpus/PutDocument';
import {watchTrainModel} from '../trainModel';
import {watchFetchModels} from '../models/FetchModels';
import {watchDeleteModel} from '../models/DeleteModel';
import {watchDeleteDocument} from '../corpus/DeleteDocument';
import {watchFetchDocuments} from '../corpus/FetchDocuments';

export const allSagas = function* () {
    yield all([watchUIInit(), watchPutDocument(), watchTrainModel(), watchFetchModels(), watchDeleteModel(), watchDeleteDocument(), watchFetchDocuments()]);
};