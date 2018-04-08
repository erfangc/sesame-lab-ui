import * as React from 'react';
import {connect} from 'react-redux';
import {DocumentTagger} from './corpus/DocumentTagger';
import {history} from './History';
import {Header} from './header/Header';
import {Route, Router, Switch} from 'react-router';
import {Container} from 'semantic-ui-react';
import {StoreState} from './reducers';
import {Home} from './Home';
import {Browse} from './browse/Browse';

interface StateProps {
    appReady: boolean
}

function mapStateToProps({appReady}: StoreState): StateProps {
    return {appReady};
}

export const App = connect(mapStateToProps)(
    class App extends React.Component<StateProps> {
        render(): React.ReactNode {
            const {appReady} = this.props;
            if (!appReady) {
                return null;
            }
            return (
                <div>
                    <Header/>
                    <Router history={history}>
                        <Container style={{marginTop: '7em'}}>
                            <Switch>
                                <Route path={'/tag'} component={DocumentTagger}/>
                                <Route path={'/browse'} component={Browse}/>
                                <Route path={'/'} component={Home}/>
                            </Switch>
                        </Container>
                    </Router>
                </div>

            );
        }
    }
);
