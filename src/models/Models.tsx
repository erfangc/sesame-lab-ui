import * as React from 'react';
import {connect} from 'react-redux';
import {Header, Button, Item} from 'semantic-ui-react';
import {NERModel} from '../reducers/models/modelsReducer';
import {StoreState} from '../reducers';
import {actions, DispatchProps} from '../reducers/actions';
import {history} from '../History';

interface StateProps {
    models: NERModel[]
}

function mapStateToProps({models: {models}}: StoreState): StateProps {
    return {models};
}

interface State {
    deleting: boolean
}

export const Models = connect(mapStateToProps, {...actions})(
    class Models extends React.Component<StateProps & DispatchProps, State> {
        constructor(props: StateProps & DispatchProps) {
            super(props);
            this.state = {
                deleting: false
            };
        }

        componentDidMount(): void {
            const {fetchModels} = this.props;
            fetchModels();
        }

        render(): React.ReactNode {
            const {models} = this.props;
            const {deleting} = this.state;
            if (models.length === 0) {
                return (<Header textAlign={'center'}>No Models were Trained</Header>)
            }
            return (
                <Item.Group divided relaxed>
                    {
                        models.map((model) => (
                            <Item key={model.modelID}>
                                <Item.Content>
                                    <Item.Header>{model.modelName}</Item.Header>
                                    <Item.Meta>
                                        <span>{model.createdByEmail}</span>
                                        <span>{model.createdOn}</span>
                                    </Item.Meta>
                                    <Item.Description>{model.modelDescription}</Item.Description>
                                    <Item.Extra>
                                        <Button
                                            primary
                                            content={'Run this Model'}
                                            disabled={deleting}
                                            onClick={() => this.runModel(model.modelID)}
                                        />
                                        <Button
                                            content={'Delete this Model'}
                                            color={'red'}
                                            disabled={deleting}
                                            loading={deleting}
                                            onClick={() => this.deleteModel(model.modelID)}
                                        />
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                        ))
                    }
                </Item.Group>
            );
        }

        private runModel = (modelID: string) => {
            const {setActiveModel} = this.props;
            setActiveModel(modelID);
            history.push('/run');
        };

        private deleteModel = (modelID: string) => {
            this.setState(() => ({deleting: true}));
            const {deleteModel} = this.props;
            deleteModel({modelID, onComplete: () => this.setState(() => ({deleting: false}))});
        };
    }
);
