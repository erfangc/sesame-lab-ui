import * as React from 'react';
import {connect} from 'react-redux';
import {Button, Dropdown, DropdownItemProps, Form, Icon, Segment} from 'semantic-ui-react';
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
    currentDocument?: Document
}

function mapStateToProps({corpusDescriptors, corpus: {currentDocument}}: StoreState): StateProps {
    return {corpusDescriptors, currentDocument};
}

interface State {
    id?: string
    loading: boolean
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
            const {annotatedText, editingSentence, corpusID, loading} = this.state;
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
                        <Button primary onClick={this.submit} loading={loading} disabled={loading || editingSentence}>
                            <Icon name={'save'}/>Save
                        </Button>
                        <Button color={'green'} basic disabled={loading || editingSentence} onClick={this.reset}>
                            <Icon name={'plus'}/>Create New
                        </Button>
                    </Button.Group>
                </React.Fragment>
            );
        }

        private changeCorpus = (corpusID: string) => {
            this.setState(({annotatedText}) => ({annotatedText: stripNERAnnotations(annotatedText), corpusID}));
        };

        private getInitialState(props: StateProps & OwnProps & DispatchProps): State {
            const {currentDocument} = props;
            return {
                loading: false,
                id: currentDocument ? currentDocument.Id : undefined,
                annotatedText: currentDocument ? currentDocument.Content : '',
                editingSentence: currentDocument == null,
                corpusID: currentDocument ? currentDocument.Corpus : props.corpusDescriptors[0].id
            };
        }

        private submit = () => {
            const {corpusID, annotatedText, id} = this.state;
            const {putDocument} = this.props;
            this.setState(() => ({loading: true}));
            putDocument({
                onComplete: id => this.setState(() => ({loading: false, id})),
                Corpus: corpusID,
                Content: annotatedText,
                Id: id
            });
        };

        private reset = () => this.setState(() => this.getInitialState(this.props));
    }
);