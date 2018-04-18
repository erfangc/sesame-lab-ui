import * as React from 'react';
import {connect} from 'react-redux';
import {Button, Form} from 'semantic-ui-react';
import {EntityConfiguration} from '../reducers/corpus/corpusReducer';
import {actions, DispatchProps} from '../reducers/actions';

interface StateProps {

}

interface OwnProps {
    entityConfiguration: EntityConfiguration
}

function mapStateToProps(): StateProps {
    return {};
}

interface State {
    entityConfiguration: EntityConfiguration
}

export const EntityConfigurationEditor = connect(mapStateToProps, {...actions})(
    class EntityConfigurationEditor extends React.Component<StateProps & OwnProps & DispatchProps, State> {

        constructor(props: StateProps & OwnProps & DispatchProps, context: any) {
            super(props, context);
            this.state = {
                entityConfiguration: props.entityConfiguration
            };
        }

        render(): React.ReactNode {
            const {entityConfiguration: {color, displayName, textColor, type}} = this.state;
            return (
                <Form.Group>
                    <Form.Field>
                        <label>Display Name</label>
                        <input value={displayName} onChange={({currentTarget:{value}}) => this.updateDisplayName(value)}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Type</label>
                        <input value={type} onChange={({currentTarget:{value}}) => this.updateType(value)}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Text Color</label>
                        <input value={textColor} onChange={({currentTarget:{value}}) => this.updateTextColor(value)}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Color</label>
                        <input value={color} onChange={({currentTarget:{value}}) => this.updateColor(value)}/>
                    </Form.Field>
                    <Form.Field>
                        <label>&nbsp;</label>
                        <Button.Group>
                            <Button icon={'save'} onClick={this.save} primary/>
                            <Button icon={'close'} onClick={this.delete} color={'red'}/>
                        </Button.Group>
                    </Form.Field>
                </Form.Group>
            );
        }

        save = () => {
            const {entityConfiguration} = this.state;
            const {saveEntityConfiguration} = this.props;
            saveEntityConfiguration(entityConfiguration);
        };

        delete = () => {
            const {deleteEntityConfiguration} = this.props;
            const {entityConfiguration: {corpusID, id}} = this.state;
            deleteEntityConfiguration({corpusID, entityConfigurationID: id});
        };

        updateType = (type: string) => this.setState(({entityConfiguration}) => ({
            entityConfiguration: {
                ...entityConfiguration,
                type
            }
        }));

        updateTextColor = (textColor: string) => this.setState(({entityConfiguration}) => ({
            entityConfiguration: {
                ...entityConfiguration,
                textColor
            }
        }));

        updateDisplayName = (displayName: string) => this.setState(({entityConfiguration}) => ({
            entityConfiguration: {
                ...entityConfiguration,
                displayName
            }
        }));

        updateColor = (color: string) => this.setState(({entityConfiguration}) => ({
            entityConfiguration: {
                ...entityConfiguration,
                color
            }
        }));
    }
);
