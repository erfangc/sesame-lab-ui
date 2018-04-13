import * as React from 'react';
import {Menu} from 'semantic-ui-react';
import {Entity, textToToken, Token, tokenToText} from '../ner/NERUtils';
import {guid} from '../utils/AppUtils';
import {CorpusDescriptor} from '../reducers/corpusDescriptors/corpusDescriptorReducer';

interface Props {
    annotatedText: string;
    onChange: (newText: string) => void;
    corpusDescriptor: CorpusDescriptor;
}

interface State {
    entityUnderEdit: Entity | undefined;
    menu: { x: number, y: number } | undefined;
    tokens: Token[];
    entities: Entity[];
}

/**
 * TextTagger is a component that accepts annotated text (either annotated by an NER algorithm or by a human)
 * and enables a user to use the mouse to edit the annotations
 *
 * each submission from this component represents an attempt to manually label the sentence for future training
 */
export class TextTagger extends React.Component<Props, State> {

    getInitialState(props: Props) {
        const {tokens, entities} = textToToken(props.annotatedText);
        /*
        populate colors
         */
        return {
            entityUnderEdit: undefined,
            menu: undefined,
            entities,
            tokens
        };
    }

    constructor(props: Props) {
        super(props);
        this.state = this.getInitialState(props);
    }

    componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
        this.setState(() => this.getInitialState(nextProps));
    }

    confirmEdit = (type: string) => this.setState(
        ({entityUnderEdit, entities, menu}) => {
            /*
            either we have a new entity or we are updating an existing entity
             */
            if (!entityUnderEdit) {
                return {entityUnderEdit, entities, menu};
            }
            const isNew = entities.find(({id}) => id === entityUnderEdit.id) === undefined;
            if (isNew) {
                return {
                    entityUnderEdit: undefined,
                    entities: [
                        ...entities,
                        {
                            ...entityUnderEdit, type
                        }
                    ],
                    menu: undefined
                };
            } else {
                return {
                    entityUnderEdit: undefined,
                    entities: entities.map((entity) => {
                        if (entity.id === entityUnderEdit.id) {
                            return {...entityUnderEdit, type};
                        } else {
                            return entity;
                        }
                    }),
                    menu: undefined
                };
            }
        },
        () => this.props.onChange(tokenToText({entities: this.state.entities, tokens: this.state.tokens})));

    cancelEdit = () => this.setState(({entityUnderEdit}) => {
        if (!entityUnderEdit) {
            return {entityUnderEdit};
        } else {
            return {
                entityUnderEdit: undefined
            };
        }
    });

    resolveTokenEntity = (token: Token): Entity | undefined => {
        const {idx} = token;
        const {entities} = this.state;
        return entities.find(({start, end}) => idx >= start && idx <= end);
    };

    deleteEntity = () => this.setState(
        ({entityUnderEdit, entities, menu}) => {
            if (!entityUnderEdit) {
                return {entityUnderEdit, entities, menu};
            } else {
                const isNew = entities.find(({id}) => id === entityUnderEdit.id) === undefined;
                if (isNew) {
                    return {entityUnderEdit: undefined, entities, menu: undefined};
                } else {
                    return {
                        entityUnderEdit: undefined,
                        entities: entities.filter((entity) => entity.id !== entityUnderEdit.id),
                        menu: undefined
                    };
                }
            }
        },
        () => this.props.onChange(tokenToText({tokens: this.state.tokens, entities: this.state.entities}))
    );

    startEntityEdit = (token: Token) => {
        const {entityUnderEdit} = this.state;
        if (entityUnderEdit !== undefined) {
            this.cancelEdit();
        }
        const entity = this.resolveTokenEntity(token);
        if (entity === undefined) {
            /*
            new entity
             */
            this.setState(() => {
                    const newEntity = {end: token.idx, start: token.idx, id: guid(), type: 'unknown'};
                    return {entityUnderEdit: newEntity};
                }
            );
            this.addTokenToEntity(token);
        } else {
            /*
            editing an existing entity
             */
            this.setState(() => {
                const entityUnderEdit = entity ? {...entity} : undefined;
                this.setState(() => ({entityUnderEdit}));
            });
        }
    };

    addTokenToEntity = (token: Token) => this.setState(({entityUnderEdit, menu}) => {
        if (entityUnderEdit === undefined || menu !== undefined) {
            return {entityUnderEdit};
        }
        return {entityUnderEdit: {...entityUnderEdit, end: Math.max(entityUnderEdit.start, token.idx)}};
    });

    removeTokenFromEntity = (token: Token) => this.setState(({entityUnderEdit, menu}) => {
        if (entityUnderEdit === undefined || menu !== undefined) {
            return {entityUnderEdit};
        }
        return {entityUnderEdit: {...entityUnderEdit, end: Math.max(entityUnderEdit.start, token.idx - 1)}};
    });

    resolveTokenStyle = (token: Token) => {
        const baseStyle = {
            padding: `2px`
        };
        const {corpusDescriptor: {entityConfigs}} = this.props;
        /*
        if the given token is currently being edited, its class is determined by the entity being edited
         */
        const {entityUnderEdit} = this.state;
        if (entityUnderEdit !== undefined && token.idx >= entityUnderEdit.start && token.idx <= entityUnderEdit.end) {
            return {
                ...baseStyle,
                backgroundColor: entityConfigs[entityUnderEdit.type].color,
                color: entityConfigs[entityUnderEdit.type].textColor
            };
        } else {
            const resolvedEntity = this.resolveTokenEntity(token);
            if (resolvedEntity !== undefined) {
                /*
                if the resolved entity is also the one being edited, also return undefined
                reaching this code path implies the user has de-selected the token
                 */
                if (entityUnderEdit !== undefined && resolvedEntity.id === entityUnderEdit.id) {
                    return baseStyle;
                } else {
                    /*
                    this code path means this token belongs to an entity and that entity is not being edited,
                    so its class is naturally that of the entity
                     */
                    return {
                        ...baseStyle,
                        backgroundColor: entityConfigs[resolvedEntity.type].color,
                        color: entityConfigs[resolvedEntity.type].textColor
                    };
                }
            } else {
                return baseStyle;
            }
        }
    };

    render(): React.ReactNode {
        const {corpusDescriptor: {entityConfigs}} = this.props;
        const {tokens, menu} = this.state;
        const spans = tokens
            .map((token) => {
                    const {idx, content} = token;
                    return (
                        <React.Fragment key={idx}>
                            <span
                                key={idx}
                                style={this.resolveTokenStyle(token)}
                                onClick={
                                    e => {
                                        const {entityUnderEdit} = this.state;
                                        if (entityUnderEdit !== undefined) {
                                            const x = e.clientX;
                                            const y = e.clientY;
                                            this.setState(() => ({menu: {x, y}}));
                                        } else {
                                            this.startEntityEdit(token);
                                        }
                                    }
                                }
                                onMouseEnter={() => this.addTokenToEntity(token)}
                                onMouseLeave={() => this.removeTokenFromEntity(token)}
                            >
                                {content}
                            </span>
                            <span>&nbsp;</span>
                        </React.Fragment>
                    );
                }
            );
        return (
            <div style={{cursor: 'pointer', userSelect: 'none', fontSize: '1.5em'}}>
                {spans}
                {
                    menu !== undefined ?
                        <div style={{position: 'fixed', zIndex: 1, top: menu.y + 10, left: menu.x}}>
                            <Menu vertical>
                                {
                                    Object
                                        .keys(entityConfigs)
                                        .filter(entity => entity !== 'unknown')
                                        .map(entity =>
                                            <Menu.Item
                                                key={entity}
                                                onClick={() => this.confirmEdit(entity)}
                                            >
                                                {entityConfigs[entity].displayName}
                                            </Menu.Item>
                                        )
                                }
                                <Menu.Item
                                    onClick={() => {
                                        this.setState(() => ({menu: undefined}));
                                        this.cancelEdit();
                                    }}
                                >
                                    Cancel
                                </Menu.Item>
                                <Menu.Item onClick={() => this.deleteEntity()}>
                                    Delete
                                </Menu.Item>
                            </Menu>
                        </div>
                        : null
                }
            </div>
        );
    }
}
