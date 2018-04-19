import * as React from 'react';
import {connect} from 'react-redux';
import {DocumentTagger} from './document/DocumentTagger';
import {history} from './History';
import {Header} from './header/Header';
import {Route, Router, Switch} from 'react-router';
import {Button, Container, Icon, Modal} from 'semantic-ui-react';
import {StoreState} from './reducers';
import {Dashboard} from './dashboard/Dashboard';
import {Browse} from './browse/Browse';
import {Train} from './models/Train';
import {Models} from './models/Models';
import {Run} from './models/Run';
import {CorpusEditorMain} from './corpus/CorpusEditorMain';
import {ErrorStore} from './reducers/error/errorReducer';
import {actions, DispatchProps} from './reducers/actions';

interface StateProps {
    appReady: boolean
    error: ErrorStore
}

function mapStateToProps({appReady, error}: StoreState): StateProps {
    return {appReady, error};
}

export const App = connect(mapStateToProps, {...actions})(
    class App extends React.Component<StateProps & DispatchProps> {
        render(): React.ReactNode {
            const {appReady} = this.props;
            if (!appReady) {
                return null;
            }
            const {error: {message}, clearError} = this.props;
            return (
                <div>
                    <Header/>
                    <Router history={history}>
                        <Container style={{marginTop: '7em'}}>
                            <Switch>
                                <Route path={'/tag'} component={DocumentTagger}/>
                                <Route path={'/edit'} component={CorpusEditorMain}/>
                                <Route path={'/browse'} component={Browse}/>
                                <Route path={'/train'} component={Train}/>
                                <Route path={'/models'} component={Models}/>
                                <Route path={'/run'} component={Run}/>
                                <Route path={'/'} component={Dashboard}/>
                            </Switch>
                        </Container>
                    </Router>
                    {
                        message !== undefined ?
                            <Modal onClose={() => clearError()} open={true} basic size={'small'}>
                                <Modal.Header icon={'archive'} content={'Server Error'}/>
                                <Modal.Content><p>{message}</p></Modal.Content>
                                <Modal.Actions>
                                    <Button basic color={'red'} inverted onClick={() => clearError()}>
                                        <Icon name={'remove'}/> Ok
                                    </Button>
                                </Modal.Actions>
                            </Modal>
                            : null
                    }
                </div>

            );
        }
    }
);
