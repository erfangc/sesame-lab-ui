import * as React from 'react';
import {Container} from 'semantic-ui-react';
import {Header} from './header/Header';
import {SingleDocumentTrainer} from './corpus/SingleDocumentTrainer';

class App extends React.Component {
    render() {
        return (
            <div>
                <Header/>
                <Container style={{marginTop: '7em'}}>
                    <SingleDocumentTrainer annotatedText={'<START:firm> BlackRock Inc. <END><START:family> S&P 500 Bank <END> Fund Inst Class'}/>
                </Container>
            </div>
        );
    }
}

export default App;
