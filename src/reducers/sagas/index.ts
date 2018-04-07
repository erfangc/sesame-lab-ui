import {all} from 'redux-saga/effects';
import {watchUIInit} from './UIInit';
import {watchPutDocument} from '../corpus/PutDocument';

export const allSagas = function* () {
    yield all([watchUIInit(), watchPutDocument()]);
};