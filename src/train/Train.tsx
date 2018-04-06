import * as React from 'react';
import {connect} from 'react-redux';
import {Input, Button, Divider, Segment} from 'semantic-ui-react';
import {TextTagger} from '../textTagger/TextTagger';
import {StoreState} from '../index';
import {EntityConfigStore} from '../reducers/entityConfigReducer';

interface StateProps {
    entityConfig: EntityConfigStore
}

function mapStateToProps({entityConfig}: StoreState): StateProps {
    return {entityConfig};
}

interface State {
    editingSentence: boolean
}

export const Train = connect(mapStateToProps)(
    class Workspace extends React.Component<StateProps, State> {

        constructor(props: StateProps) {
            super(props);
            this.state = {
                editingSentence: false
            };
        }

        render(): React.ReactNode {
            const {entityConfig} = this.props;
            const {editingSentence} = this.state;
            return (
                <React.Fragment>
                    <Segment>
                        {
                            editingSentence ?
                                <React.Fragment>
                                    <p><span style={{color: 'orange'}}>WARNING: </span> Changing the content of the sentence erases existing tags</p>
                                    <Input value={'BlackRock High Yield Bond ETF'} onChange={() => null} size={'large'} fluid/>
                                    <br/>
                                    <Button.Group>
                                        <Button basic color={'green'} onClick={() => this.setState(() => ({editingSentence: false}))}>Confirm</Button>
                                        <Button basic color={'red'} onClick={() => this.setState(() => ({editingSentence: false}))}>Cancel</Button>
                                    </Button.Group>
                                </React.Fragment> :
                                <React.Fragment>
                                    <p>Highlight part of the sentence and identify what they are</p>
                                    <TextTagger
                                        annotatedText={'<START:firm> BlackRock Inc. <END><START:family> S&P 500 Bank <END> Fund Inst Class'}
                                        onChange={(newText) => console.log(newText)}
                                        entityConfig={entityConfig}
                                    />
                                    <br/>
                                    <Button.Group>
                                        <Button primary basic onClick={() => this.setState(() => ({editingSentence: true}))}>Edit the Sentence</Button>
                                    </Button.Group>
                                </React.Fragment>
                        }
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
                    </Segment>
                    <Button.Group floated={'right'}>
                        <Button primary>Save</Button>
                    </Button.Group>
                </React.Fragment>
            );
        }
    }
);
