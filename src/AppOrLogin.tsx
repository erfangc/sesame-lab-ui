import * as React from 'react';
import {connect} from 'react-redux';
import {Login} from './Login';
import {StoreState} from './reducers';
import {App} from './App';

interface StateProps {
    isAuthenticated: boolean
}

function mapStateToProps({auth: {isAuthenticated}}: StoreState): StateProps {
    return {isAuthenticated};
}

export const AppOrLogin = connect(mapStateToProps)(
    class AppOrLogin extends React.Component<StateProps> {
        render(): React.ReactNode {
            const {isAuthenticated} = this.props;
            return !isAuthenticated ? <Login/> : <App/>;
        }
    }
);
