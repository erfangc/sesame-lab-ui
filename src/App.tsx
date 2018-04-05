import * as React from 'react';
import './App.css';
import {TextTagger} from './TextTagger';

class App extends React.Component {
    render() {
        return (
            <TextTagger
                annotatedText={'<START:firm> BlackRock Inc.<END><START:family> S&P 500 Bank <END> Fund Inst Class'}
                onChange={(newText) => console.log(newText)}
                entityConfig={{
                    firm: {color: '#E27D60', textColor: '#333', displayName: 'Firm'},
                    family: {color: '#659DBD', textColor: '#333', displayName: 'Family'},
                    unknown: {color: '#666', textColor: '#fff', displayName: 'Unknown'}
                }}
            />
        );
    }
}

export default App;
