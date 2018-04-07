import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {AppOrLogin} from './App';
import registerServiceWorker from './registerServiceWorker';
import 'semantic-ui-css/semantic.css';
import {Provider} from 'react-redux';
import {applyMiddleware, combineReducers, createStore, Reducer, Store} from 'redux';
import {entityConfigReducer, EntityConfigStore} from './reducers/entityConfigReducer';
import {createLogger} from 'redux-logger';
import {authReducer, AuthStore} from './reducers/auth/authReducer';

export interface StoreState {
    entityConfig: EntityConfigStore
    auth: AuthStore
}
const rootReducer: Reducer<StoreState> = combineReducers({entityConfig: entityConfigReducer, auth: authReducer});
export const store: Store<StoreState> = createStore(rootReducer, applyMiddleware(createLogger()));

ReactDOM.render(
    (
        <Provider store={store}>
            <AppOrLogin/>
        </Provider>
    ),
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
