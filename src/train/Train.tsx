import * as React from 'react';
import {connect} from 'react-redux';
import {Button, Divider, Segment} from 'semantic-ui-react';
import {TextTagger} from '../textTagger/TextTagger';
import {StoreState} from '../index';
import {EntityConfigStore} from '../reducers/entityConfigReducer';

interface StateProps {
    entityConfig: EntityConfigStore
}

function mapStateToProps({entityConfig}: StoreState): StateProps {
    return {entityConfig};
}

export const Train = connect(mapStateToProps)(
    class Workspace extends React.Component<StateProps> {
        render(): React.ReactNode {
            const {entityConfig} = this.props;
            return (
                <React.Fragment>
                    <Segment>
                        <p>Highlight part of the sentence and identify what they are</p>
                        <TextTagger
                            annotatedText={'<START:firm> BlackRock Inc.<END><START:family> S&P 500 Bank <END> Fund Inst Class'}
                            onChange={(newText) => console.log(newText)}
                            entityConfig={entityConfig}
                        />
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
                    <Button.Group floated={'left'}>
                        <Button secondary>Previous</Button>
                    </Button.Group>
                    <Button.Group floated={'right'}>
                        <Button primary>Next</Button>
                    </Button.Group>
                </React.Fragment>
            );
        }
    }
);
