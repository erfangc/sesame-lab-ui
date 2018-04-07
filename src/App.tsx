import * as React from 'react';
import {Container} from 'semantic-ui-react';
import {SingleDocumentTrainer} from './corpus/SingleDocumentTrainer';
import {connect} from 'react-redux';
import {StoreState} from './index';
import {Login} from './Login';
import {Header} from './header/Header';

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

class App extends React.Component {
    render(): React.ReactNode {
        return (
            <div>
                <Header/>
                <Container style={{marginTop: '7em'}}>
                    <SingleDocumentTrainer
                        annotatedText={'<START:firm> BlackRock Inc. <END><START:family> S&P 500 Bank <END> Fund Inst Class'}
                    />
                </Container>
            </div>

        );
    }
}
