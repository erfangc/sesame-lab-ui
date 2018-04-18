import * as React from 'react';
import {connect} from 'react-redux';
import {StoreState} from '../reducers';
import {CorpusChooser} from '../corpus/CorpusChooser';
import {Button, Form} from 'semantic-ui-react';
import {CorpusDescriptor} from '../reducers/corpusDescriptors/corpusDescriptorReducer';
import {actions, DispatchProps} from '../reducers/actions';
import {history} from '../History';

interface StateProps {
    corpusDescriptors: CorpusDescriptor[]
}

function mapStateToProps({corpusDescriptors:{corpusDescriptors}}: StoreState): StateProps {
    return {corpusDescriptors};
}

interface State {
    name: string
    description?: string
    modifiedAfter?: string
    corpusID: string
    loading: boolean
}

export const Train = connect(mapStateToProps, {...actions})(
    class Train extends React.Component<StateProps & DispatchProps, State> {

        constructor(props: StateProps & DispatchProps, context: any) {
            super(props, context);
            const {corpusDescriptors} = props;
            this.state = {
                loading: false,
                name: '',
                description: undefined,
                corpusID: corpusDescriptors[0].id,
                modifiedAfter: undefined
            };
        }

        render(): React.ReactNode {
            const {corpusID, loading, description, name, modifiedAfter} = this.state;
            return (
                <div>
                    <Form>
                        <CorpusChooser
                            corpusID={corpusID}
                            onChange={({id}) => this.setState(() => ({corpusID: id}))}
                        />
                        <Form.Group>
                            <Form.Field width={6}>
                                <label>Model Name</label>
                                <input
                                    value={name}
                                    onChange={({currentTarget: {value}}) => this.setState(() => ({name: value}))}
                                />
                            </Form.Field>
                            <Form.Field width={10}>
                                <label>Only Include Data After</label>
                                <input
                                    type={'date'}
                                    value={modifiedAfter || '2017-01-01'}
                                    onChange={({currentTarget: {value}}) => this.setState(() => ({modifiedAfter: value}))}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Field>
                            <label>Model Description</label>
                            <textarea
                                value={description}
                                onChange={({currentTarget: {value}}) => this.setState(() => ({description: value}))}
                            />
                        </Form.Field>
                        <Button
                            content={'Submit'}
                            primary
                            disabled={loading}
                            loading={loading}
                            onClick={this.submit}
                        />
                    </Form>
                </div>
            );
        }

        private submit = () => {
            this.setState(() => ({loading: true}));
            const {trainModel} = this.props;
            const {modifiedAfter, description, name, corpusID} = this.state;
            trainModel({
                modifiedAfter: new Date(modifiedAfter || '2017-01-01').valueOf(),
                description,
                name,
                corpusID,
                onComplete: () => {
                    this.setState(() => ({loading: false}));
                    setTimeout(() => history.push('/models'), 250);
                }
            });
        };

    }
);
