import * as React from 'react';
import {connect} from 'react-redux';
import {Button, Icon, Segment} from 'semantic-ui-react';
import {TextTagger} from '../textTagger/TextTagger';
import {DocumentEditor} from './DocumentEditor';
import {stripNERAnnotations} from '../ner/NERUtils';
import {actions, DispatchProps} from '../reducers/actions';
import {Document} from './Document';
import {CorpusDescriptor} from '../reducers/corpusDescriptors/corpusDescriptorReducer';
import {StoreState} from '../reducers';
import {Legend} from './Legend';
import {CorpusChooser} from './CorpusChooser';
import {UserProfile} from '../reducers/auth/authReducer';

interface StateProps {
    corpusDescriptors: CorpusDescriptor[]
    activeDocument?: Document
    userProfile?: UserProfile
}

function mapStateToProps({auth: {userProfile}, corpusDescriptors, corpus: {activeDocument}}: StoreState): StateProps {
    return {corpusDescriptors, activeDocument, userProfile};
}

interface State {
    loading: boolean
    editingSentence: boolean
    document: Document
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
            const {editingSentence, loading, document: {corpus: corpusID, content}} = this.state;
            const corpusDescriptor = corpusDescriptors.find(({id}) => id === corpusID);
            if (corpusDescriptor == null) {
                throw `could not find corpus with id = ${corpusID} in ${JSON.stringify(corpusDescriptors)}`;
            }
            return (
                <React.Fragment>
                    <Segment>
                        <CorpusChooser
                            onChange={(corpusDescriptor) => this.changeCorpus(corpusDescriptor.id)}
                            disabled={editingSentence}
                            corpusID={corpusID}
                            standalone
                        />
                        <br/>
                        {
                            editingSentence
                                ?
                                <DocumentEditor
                                    onCancel={() => this.setState(() => ({editingSentence: false}))}
                                    onSubmit={this.updateContent}
                                    value={stripNERAnnotations(content)}
                                />
                                :
                                <React.Fragment>
                                    <p>Highlight part of the sentence and identify what they are</p>
                                    <TextTagger
                                        annotatedText={content}
                                        onChange={content => this.updateContent(content)}
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
                        <Button color={'green'} basic disabled={loading || editingSentence} onClick={this.createNew}>
                            <Icon name={'plus'}/>Create New
                        </Button>
                    </Button.Group>
                </React.Fragment>
            );
        }

        componentWillReceiveProps(nextProps: Readonly<StateProps & OwnProps & DispatchProps>, nextContext: any): void {
            this.setState(state => ({...state, ...this.getInitialState(nextProps)}));
        }

        private updateContent = (content: string) => this.setState(({document}) => ({
            editingSentence: false,
            document: {
                ...document,
                content
            }
        }));

        private changeCorpus = (corpus: string) => {
            // if we are changing corpus, then all existing tagged entities are removed
            this.setState(({document}) => ({
                document: {
                    ...document,
                    corpus,
                    content: stripNERAnnotations(document.content)
                }
            }));
        };

        private getInitialState(props: StateProps & OwnProps & DispatchProps): State {
            const {activeDocument, userProfile, corpusDescriptors} = props;
            if (userProfile === undefined) {
                throw 'user profile is not defined';
            }
            /*
            if active document is not set, then we are dealing with a brand new document
             */
            if (activeDocument == null) {
                const {email, id, nickname} = userProfile;
                return {
                    loading: false,
                    editingSentence: true,
                    document: {
                        content: '',
                        corpus: corpusDescriptors[0].id,
                        entities: [],
                        lastModifiedOn: new Date().valueOf(),
                        lastModifiedBy: id,
                        lastModifiedByNickname: nickname,
                        lastModifiedByEmail: email,
                        createdOn: new Date().valueOf(),
                        createdBy: id,
                        createdByNickname: nickname,
                        createdByEmail: email
                    }
                };
            } else {
                /*
                otherwise we are editing an existing document
                 */
                return {
                    loading: false,
                    editingSentence: false,
                    document: {
                        ...activeDocument
                    }
                };
            }
        }

        private submit = () => {
            const {document} = this.state;
            const {putDocument} = this.props;
            this.setState(() => ({loading: true}));
            putDocument({
                onComplete: () => this.setState(() => ({loading: false})),
                document
            });
        };

        private createNew = () => {
            const {setActiveDocument} = this.props;
            setActiveDocument(null);
        };
    }
);