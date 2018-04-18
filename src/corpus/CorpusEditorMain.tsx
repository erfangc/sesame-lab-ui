import * as React from 'react';
import {connect} from 'react-redux';
import {Button, Container, Divider} from 'semantic-ui-react';
import {CorpusChooser} from './CorpusChooser';
import {actions, DispatchProps} from '../reducers/actions';
import {StoreState} from '../reducers';
import {CorpusDescriptor} from '../reducers/corpusDescriptors/corpusDescriptorReducer';
import {CorpusEditor} from './CorpusEditor';
import {history} from '../History';

interface StateProps {
    corpusDescriptor?: CorpusDescriptor
}

function mapStateToProps({corpusDescriptors: {corpusDescriptors, activeCorpusID}}: StoreState): StateProps {
    const corpusDescriptor = corpusDescriptors.find(({id}) => id === activeCorpusID);
    return {corpusDescriptor};
}

export const CorpusEditorMain = connect(mapStateToProps, {...actions})(
    class CorpusEditorMain extends React.Component<StateProps & DispatchProps> {
        render(): React.ReactNode {
            const {setActiveCorpusID, corpusDescriptor} = this.props;
            if (!corpusDescriptor) {
                return (
                    <div>
                        <CorpusChooser
                            onChange={({id}) => setActiveCorpusID(id)}
                            label={'Choose a Corpus to Edit'}
                            standalone
                        />
                        <Divider horizontal> Or </Divider>
                        <Button
                            content={'Create a New Corpus'}
                            color={'green'}
                            icon={'plus'}
                            onClick={() => history.push('/edit/new')}
                        />
                    </div>
                );
            } else {
                return <CorpusEditor/>;
            }
        }
    }
);
