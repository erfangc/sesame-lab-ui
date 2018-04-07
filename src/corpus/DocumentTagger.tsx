import * as React from 'react';
import {connect} from 'react-redux';
import {Button, Dropdown, DropdownItemProps, Form, Segment} from 'semantic-ui-react';
import {TextTagger} from '../textTagger/TextTagger';
import {DocumentEditor} from './DocumentEditor';
import {stripNERAnnotations} from '../ner/NERUtils';
import {actions, DispatchProps} from '../reducers/actions';
import {Document} from './Document';
import {CorpusDescriptor} from '../reducers/corpusDescriptors/corpusDescriptorReducer';
import {StoreState} from '../reducers';
import {Legend} from './Legend';

interface StateProps {
    corpusDescriptors: CorpusDescriptor[]
    document?: Document
}

function mapStateToProps({corpusDescriptors}: StoreState) {
    return {corpusDescriptors};
}

interface State {
    editingSentence: boolean
    annotatedText: string
    corpusID: string
}

interface OwnProps {

}

export const DocumentTagger = connect(mapStateToProps, {...actions})(
    class DocumentTagger extends React.Component<StateProps & OwnProps & DispatchProps, State> {

        constructor(props: StateProps & OwnProps & DispatchProps) {
            super(props);
            this.state = this.getInitialState(props);
        }

        render(): React.ReactNode {
            const {corpusDescriptors} = this.props;
            const {annotatedText, editingSentence, corpusID} = this.state;
            const corpusDescriptor = corpusDescriptors.find(({id}) => id === corpusID);
            if (corpusDescriptor == null) {
                throw `could not find corpus with id = ${corpusID} in ${JSON.stringify(corpusDescriptors)}`;
            }
            const options: DropdownItemProps[] = corpusDescriptors.map(({id, title}) => ({
                key: id,
                value: id,
                text: title
            }));
            return (
                <React.Fragment>
                    <Segment>
                        <Form>
                            <Form.Field width={4}>
                                <label>Corpus</label>
                                <Dropdown
                                    selection
                                    disabled={editingSentence}
                                    options={options}
                                    value={corpusID}
                                    onChange={(e, data) => this.changeCorpus(data.value as string)}
                                />
                            </Form.Field>
                        </Form>
                        <br/>
                        {
                            editingSentence
                                ?
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
                                        corpusDescriptor={corpusDescriptor}
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
                        <Legend corpusDescriptor={corpusDescriptor}/>
                    </Segment>
                    <Button.Group floated={'right'}>
                        <Button primary onClick={this.submit}>Save</Button>
                    </Button.Group>
                </React.Fragment>
            );
        }

        private changeCorpus = (corpusID: string) => {
            this.setState(({annotatedText}) => ({annotatedText: stripNERAnnotations(annotatedText), corpusID}));
        };

        private getInitialState(props: StateProps & OwnProps & DispatchProps) {
            const {document} = props;
            return {
                annotatedText: document ? document.Content : '',
                editingSentence: document == null,
                corpusID: document ? document.Corpus : props.corpusDescriptors[0].id
            };
        }

        private submit = () => {
            const {corpusID, annotatedText} = this.state;
            const {putDocument, document} = this.props;
            putDocument({Corpus: corpusID, Content: annotatedText, Id: document != null ? document.Id : undefined});
            this.setState(() => this.getInitialState(this.props));
        };

    }
);