import {all} from 'redux-saga/effects';
import {watchUIInit} from './UIInit';
import {watchPutDocument} from '../document/PutDocument';
import {watchTrainModel} from '../models/trainModel';
import {watchFetchModels} from '../models/FetchModels';
import {watchDeleteModel} from '../models/DeleteModel';
import {watchDeleteDocument} from '../document/DeleteDocument';
import {watchFetchDocuments} from '../document/FetchDocuments';
import {watchSaveCorpus} from '../corpus/SaveCorpus';
import {watchFetchCorpus} from '../corpus/FetchCorpus';
import {watchSaveEntityConfiguration} from '../corpus/SaveEntityConfiguration';
import {watchDeleteCorpus} from '../corpus/DeleteCorpus';
import {watchDeleteEntityConfiguration} from '../corpus/DeleteEntityConfiguration';
import {watchNewCorpus} from '../corpus/NewCorpus';

export const allSagas = function* () {
    yield all(
        [
            watchUIInit(),
            watchPutDocument(),
            watchTrainModel(),
            watchFetchModels(),
            watchDeleteModel(),
            watchDeleteDocument(),
            watchFetchDocuments(),
            watchSaveCorpus(),
            watchFetchCorpus(),
            watchSaveEntityConfiguration(),
            watchDeleteCorpus(),
            watchDeleteEntityConfiguration(),
            watchNewCorpus()
        ]
    );
};