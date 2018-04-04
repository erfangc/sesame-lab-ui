import * as React from 'react';
import './App.css';
import {TextTagger} from './TextTagger';

class App extends React.Component {
    render() {
        return (
            <TextTagger annotatedText={'<START:firm> BlackRock <END> Inc. <START:family> S&P 500 Bank <END> Fund Inst Class'}/>
        );
    }
}

export default App;
