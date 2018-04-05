import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'semantic-ui-css/semantic.css';
import {Provider} from 'react-redux';
import {applyMiddleware, combineReducers, createStore, Reducer, Store} from 'redux';
import {entityConfigReducer, EntityConfigStore} from './reducers/entityConfigReducer';
import {createLogger} from 'redux-logger';
/*
create redux store
 */
const logger = createLogger();
export interface StoreState {
    entityConfig: EntityConfigStore
}

const initialState: StoreState = {
    entityConfig: {
        firm: {color: '#E27D60', textColor: '#333', displayName: 'Management Firm'},
        family: {color: '#659DBD', textColor: '#f4f4f4', displayName: 'Fund Family'},
        unknown: {color: '#666', textColor: '#fff', displayName: 'Unknown'}
    },
};
const rootReducer: Reducer<StoreState> = combineReducers({entityConfig: entityConfigReducer});
const store: Store<StoreState> = createStore(rootReducer, initialState, applyMiddleware(logger));

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
