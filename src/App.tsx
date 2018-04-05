import * as React from 'react';
import {Container} from 'semantic-ui-react';
import {Header} from './header/Header';
import {Workspace} from './workspace/Workspace';

class App extends React.Component {
    render() {
        return (
            <div>
                <Header/>
                <Container style={{marginTop: '7em'}}>
                    <Workspace/>
                </Container>
            </div>
        );
    }
}

export default App;
