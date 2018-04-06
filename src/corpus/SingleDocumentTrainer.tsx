import * as React from 'react';
import {connect} from 'react-redux';
import {Button, Divider, Segment} from 'semantic-ui-react';
import {TextTagger} from '../textTagger/TextTagger';
import {StoreState} from '../index';
import {EntityConfigStore} from '../reducers/entityConfigReducer';
import {DocumentEditor} from './DocumentEditor';
import {stripNERAnnotations} from '../ner/NerUtils';

interface StateProps {
    entityConfig: EntityConfigStore
}

function mapStateToProps({entityConfig}: StoreState): StateProps {
    return {entityConfig};
}

interface State {
    editingSentence: boolean
    annotatedText: string
}

interface OwnProps {
    annotatedText: string
}

export const SingleDocumentTrainer = connect(mapStateToProps)(
    class Workspace extends React.Component<StateProps & OwnProps, State> {

        constructor(props: StateProps & OwnProps) {
            super(props);
            this.state = {
                editingSentence: false,
                annotatedText: props.annotatedText
            };
        }

        render(): React.ReactNode {
            const {entityConfig} = this.props;
            const {annotatedText, editingSentence} = this.state;
            return (
                <React.Fragment>
                    <Segment>
                        {
                            editingSentence ?
                                <DocumentEditor
                                    onCancel={() => this.setState(() => ({editingSentence: false}))}
                                    onSubmit={
                                        annotatedText => this.setState(() => ({
                                            editingSentence: false,
                                            annotatedText
                                        }))
                                    }
                                    value={stripNERAnnotations(annotatedText)}
                                />
                                :
                                <React.Fragment>
                                    <p>Highlight part of the sentence and identify what they are</p>
                                    <TextTagger
                                        annotatedText={annotatedText}
                                        onChange={annotatedText => this.setState(() => ({annotatedText}))}
                                        entityConfig={entityConfig}
                                    />
                                    <br/>
                                    <Button.Group>
                                        <Button
                                            primary
                                            basic
                                            onClick={() => this.setState(() => ({editingSentence: true}))}
                                        >
                                            Edit the Sentence
                                        </Button>
                                    </Button.Group>
                                </React.Fragment>
                        }
                        <Legend entityConfig={entityConfig}/>
                    </Segment>
                    <Button.Group floated={'right'}>
                        <Button primary>Save</Button>
                    </Button.Group>
                </React.Fragment>
            );
        }
    }
);

interface LegendProps {
    entityConfig: EntityConfigStore
}

class Legend extends React.Component<LegendProps> {
    render(): React.ReactNode {
        const {entityConfig} = this.props;
        return (
            <React.Fragment>
                <Divider horizontal> Legend </Divider>
                <div>
                    {
                        Object
                            .keys(entityConfig)
                            .map(type => (
                                    <div key={type}>
                                                <span
                                                    style={{borderLeft: `10px solid ${entityConfig[type].color}`}}
                                                >
                                                    &nbsp;
                                                </span>
                                        {entityConfig[type].displayName}
                                    </div>
                                )
                            )
                    }
                </div>
            </React.Fragment>
        );
    }
}