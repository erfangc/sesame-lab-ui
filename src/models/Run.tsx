import * as React from 'react';
import {connect} from 'react-redux';
import {NERModel} from '../reducers/models/modelsReducer';
import {StoreState} from '../reducers';
import {history} from '../History';
import {Button, Divider, Form, Segment} from 'semantic-ui-react';
import axios from 'axios';
import {apiRoot} from '../index';
import {TextTagger} from '../textTagger/TextTagger';
import {CorpusDescriptor} from '../reducers/corpusDescriptors/corpusDescriptorReducer';
import {Legend} from '../corpus/Legend';

interface StateProps {
    model?: NERModel
    corpusDescriptors: CorpusDescriptor[]
}

function mapStateToProps({models: {activeModel, models}, corpusDescriptors}: StoreState): StateProps {
    const model = models.find(({model: {id}}) => id === activeModel);
    return {model: model === undefined ? undefined : model.model, corpusDescriptors};
}

interface State {
    loading: boolean
    result: string
    sentence: string
}

export const Run = connect(mapStateToProps)(
    class Run extends React.Component<StateProps, State> {

        constructor(props: StateProps, context: any) {
            super(props, context);
            this.state = {
                loading: false,
                result: '',
                sentence: ''
            };
        }

        render(): React.ReactNode {
            const {model} = this.props;
            const {loading, result, sentence} = this.state;
            if (!model) {
                return (
                    <p>
                        No Model Selected Click <a onClick={() => history.push('/models')}>Here</a> to Select a Model
                    </p>
                );
            }
            const corpusDescriptor = this.props.corpusDescriptors.find(({id}) => id === model.corpusID);
            if (corpusDescriptor == null
            ) {
                return null;
            }
            return (
                <div>
                    <Form>
                        <Form.Field>
                            <label>Enter a Sentence to Run</label>
                            <input
                                value={sentence}
                                onChange={({currentTarget: {value}}) => this.setState(() => ({sentence: value}))}
                            />
                        </Form.Field>
                        <Button
                            content={'Submit'}
                            primary
                            disabled={loading}
                            loading={loading}
                            onClick={this.run}
                        />
                    </Form>
                    <Divider horizontal>Results</Divider>
                    <Segment>
                        <TextTagger corpusDescriptor={corpusDescriptor} onChange={() => null} annotatedText={result}/>
                        <Legend corpusDescriptor={corpusDescriptor}/>
                    </Segment>
                </div>
            );
        }

        private run = () => {
            const {model} = this.props;
            const {sentence} = this.state;
            if (model !== undefined) {
                const {id} = model;
                axios
                    .get<string>(`${apiRoot}/api/v1/ner/${id}/run`, {params: {sentence}})
                    .then((resp) => this.setState(() => ({result: resp.data})));
            }
        };
    }
);
