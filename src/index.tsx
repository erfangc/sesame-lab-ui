import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {AppOrLogin} from './AppOrLogin';
import registerServiceWorker from './registerServiceWorker';
import 'semantic-ui-css/semantic.css';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore, Store} from 'redux';
import {createLogger} from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';
import {rootReducer, StoreState} from './reducers';
import {allSagas} from './reducers/sagas';
import axios from 'axios';

/**
 * I use both sagas and thunk here because for certain relatively simple async interactions sagas is too much overhead
 * and writing a thunk is more readable
 *
 * sagas is reserved for working with truly convoluted orchestrations
 */
const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger();
export const store: Store<StoreState> = createStore(rootReducer, applyMiddleware(loggerMiddleware, sagaMiddleware, thunkMiddleware));
export const apiRoot = process.env.REACT_APP_BASE_URL;

sagaMiddleware.run(allSagas);

axios.interceptors.request.use(
    (config) => {
        const {auth: {accessToken}} = store.getState();
        /*
        add Authorization if accessToken is defined
         */
        if (accessToken !== null) {
            return {...config, headers: {...config.headers, Authorization: `Bearer ${accessToken}`}};
        } else {
            return config;
        }
    },
    (error) => {
        console.error(error);
    }
);

ReactDOM.render(
    (
        <Provider store={store}>
            <AppOrLogin/>
        </Provider>
    ),
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
