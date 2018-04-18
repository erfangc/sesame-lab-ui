import * as React from 'react';
import {connect} from 'react-redux';
import {Button, Divider, Form} from 'semantic-ui-react';
import {CorpusDescriptor, EntityConfiguration} from '../reducers/corpusDescriptors/corpusDescriptorReducer';
import {StoreState} from '../reducers';
import {guid} from '../utils/AppUtils';
import {UserProfile} from '../reducers/auth/authReducer';
import {Corpus} from '../reducers/corpusDescriptors/SaveCorpus';
import {actions, DispatchProps} from '../reducers/actions';
import {EntityConfigurationEditor} from './EntityConfigurationEditor';
import {history} from '../History';

interface StateProps {
    corpusDescriptor?: CorpusDescriptor
    userProfile?: UserProfile
}

interface State {
    corpus: Corpus
    entityConfigurations: EntityConfiguration[]
}

function mapStateToProps({corpusDescriptors: {activeCorpusID, corpusDescriptors}, auth: {userProfile}}: StoreState): StateProps {
    const corpusDescriptor = corpusDescriptors.find(({id}) => id === activeCorpusID);
    return {corpusDescriptor, userProfile};
}

export const CorpusEditor = connect(mapStateToProps, {...actions})(
    class CorpusEditor extends React.Component<StateProps & DispatchProps, State> {

        getInitialState(props: StateProps & DispatchProps): State {
            const {corpusDescriptor, userProfile} = props;
            if (corpusDescriptor !== undefined) {
                const {id, title, userID, entityConfigs} = corpusDescriptor;
                return {
                    corpus: {
                        id,
                        title,
                        userID
                    },
                    entityConfigurations: Object.keys(entityConfigs).map(key => entityConfigs[key])
                };
            } else {
                if (!userProfile) {
                    throw 'user profile not defined';
                }
                return {
                    corpus: {
                        userID: userProfile.id,
                        title: 'New Corpus',
                        id: guid()
                    },
                    entityConfigurations: []
                };
            }

        };

        componentWillReceiveProps(nextProps: Readonly<StateProps & DispatchProps>, nextContext: any): void {
            this.setState(() => this.getInitialState(nextProps));
        }

        constructor(props: StateProps & DispatchProps) {
            super(props);
            this.state = this.getInitialState(props);
        }

        render(): React.ReactNode {
            const {corpus, entityConfigurations} = this.state;
            const {saveCorpus, setActiveCorpusID, deleteCorpus, corpusDescriptor} = this.props;
            return (
                <Form>
                    <Form.Group>
                        <Form.Field>
                            <label>Name of the Corpus</label>
                            <input
                                placeholder={'ex: News, Stock Commentary'}
                                value={corpus.title}
                                onChange={({currentTarget}) => this.updateTitle(currentTarget.value)}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>&nbsp;</label>
                            <Button primary onClick={() => saveCorpus(corpus)} icon={'save'}/>
                        </Form.Field>
                    </Form.Group>
                    <Divider horizontal>Entity Definitions / Configurations</Divider>
                    {
                        entityConfigurations.length === 0 ?
                            <p>You have no entities defined on this corpus</p>
                            :
                            entityConfigurations
                                .map(
                                    entityConfiguration => (
                                        <EntityConfigurationEditor key={entityConfiguration.id} entityConfiguration={entityConfiguration}/>
                                    )
                                )
                    }
                    <Button
                        primary
                        content={'Add an Entity'}
                        icon={'plus'}
                        onClick={() => this.addNewEntity()}
                    />
                    <Divider horizontal> Actions </Divider>
                    <Button.Group>
                        <Button
                            basic
                            content={'Back'}
                            color={'orange'}
                            icon={'undo'}
                            onClick={() => {
                                setActiveCorpusID(undefined);
                                setTimeout(() => history.push('/edit'));
                            }}
                        />
                        <Button
                            basic
                            content={'Delete the Selected Corpus'}
                            color={'red'}
                            icon={'remove'}
                            onClick={() => deleteCorpus(corpus.id)}
                            disabled={!corpusDescriptor}
                        />
                    </Button.Group>
                </Form>
            );
        }

        updateTitle = (title: string) => this.setState(({corpus}) => ({corpus: {...corpus, title}}));

        addNewEntity = () => {
            const {saveEntityConfiguration} = this.props;
            const {corpus: {id: corpusID}, entityConfigurations} = this.state;
            saveEntityConfiguration({
                id: guid(),
                corpusID,
                type: `New Type ${entityConfigurations.length}`,
                textColor: '#fff',
                displayName: 'New Type',
                color: '#999'
            });
        };
    }
);