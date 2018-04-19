import * as React from 'react';
import {connect} from 'react-redux';
import {Button, Divider} from 'semantic-ui-react';
import {CorpusChooser} from './CorpusChooser';
import {actions, DispatchProps} from '../reducers/actions';
import {StoreState} from '../reducers';
import {CorpusDescriptor} from '../reducers/corpus/corpusReducer';
import {CorpusEditor} from './CorpusEditor';

interface StateProps {
    corpusDescriptor?: CorpusDescriptor
}

function mapStateToProps({corpus: {corpusDescriptors, activeCorpusID}}: StoreState): StateProps {
    const corpusDescriptor = corpusDescriptors.find(({id}) => id === activeCorpusID);
    return {corpusDescriptor};
}

export const CorpusEditorMain = connect(mapStateToProps, {...actions})(
    class CorpusEditorMain extends React.Component<StateProps & DispatchProps> {
        render(): React.ReactNode {
            const {setActiveCorpusID, corpusDescriptor, newCorpus} = this.props;
            if (!corpusDescriptor) {
                return (
                    <div>
                        <CorpusChooser
                            onChange={({id}) => setActiveCorpusID(id)}
                            label={'Choose a Corpus to Edit'}
                            corpusID={''}
                            standalone
                        />
                        <Divider horizontal> Or </Divider>
                        <Button
                            content={'Create a New Corpus'}
                            color={'green'}
                            icon={'plus'}
                            onClick={() => newCorpus()}
                        />
                    </div>
                );
            } else {
                return <CorpusEditor/>;
            }
        }
    }
);
