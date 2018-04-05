import * as React from 'react';
import {Container} from 'semantic-ui-react';
import {Header} from './header/Header';
import {Train} from './train/Train';

class App extends React.Component {
    render() {
        return (
            <div>
                <Header/>
                <Container style={{marginTop: '7em'}}>
                    <Train/>
                </Container>
            </div>
        );
    }
}

export default App;
