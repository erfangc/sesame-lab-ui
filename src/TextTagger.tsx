import * as React from 'react';
import {Menu} from 'semantic-ui-react';

interface Props {
    annotatedText: string
    onChange: (newText: string) => void
    entityConfig: { [type: string]: EntityConfig }
}

interface Token {
    idx: number
    content: string
}

interface EntityConfig {
    displayName: string
    color: string
    textColor: string
}

interface Entity {
    id: string
    type: string
    start: number
    end: number
}

interface State {
    entityUnderEdit: Entity | undefined
    menu: { x: number, y: number } | undefined
    tokens: Token[]
    entities: Entity[]
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

    confirmEdit = (type: string) => this.setState(({entityUnderEdit, entities, menu}) => {
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

    deleteEntity = () => this.setState(({entityUnderEdit, entities, menu}) => {
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

    resolveTokenStyle = (token: Token): any => {
        const {entityConfig} = this.props;
        /*
        if the given token is currently being edited, its class is determined by the entity being edited
         */
        const {entityUnderEdit} = this.state;
        if (entityUnderEdit !== undefined && token.idx >= entityUnderEdit.start && token.idx <= entityUnderEdit.end) {
            return {
                backgroundColor: entityConfig[entityUnderEdit.type].color,
                color: entityConfig[entityUnderEdit.type].textColor
            };
        } else {
            const resolvedEntity = this.resolveTokenEntity(token);
            if (resolvedEntity !== undefined) {
                /*
                if the resolved entity is also the one being edited, also return undefined
                reaching this code path implies the user has de-selected the token
                 */
                if (entityUnderEdit !== undefined && resolvedEntity.id === entityUnderEdit.id) {
                    return undefined;
                } else {
                    /*
                    this code path means this token belongs to an entity and that entity is not being edited,
                    so its class is naturally that of the entity
                     */
                    return {
                        backgroundColor: entityConfig[resolvedEntity.type].color,
                        color: entityConfig[resolvedEntity.type].textColor
                    };
                }
            } else {
                return undefined;
            }
        }
    };

    render(): React.ReactNode {
        const {entityConfig} = this.props;
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
            <div style={{cursor: 'pointer', userSelect: 'none', fontSize: '1.5em', position: 'relative'}}>
                {spans}
                {
                    menu !== undefined ?
                        <div style={{position: 'absolute', top: menu.y + 10, left: menu.x}}>
                            <Menu vertical>
                                {
                                    Object
                                        .keys(entityConfig)
                                        .filter(entity => entity !== 'unknown')
                                        .map(entity =>
                                            <Menu.Item
                                                key={entity}
                                                onClick={() => this.confirmEdit(entity)}
                                            >
                                                {entityConfig[entity].displayName}
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

/**
 * convert tokens and entities objects to string
 * @return {string}
 * @param args
 */
function tokenToText(args: { tokens: Token[], entities: Entity[] }): string {
    const {entities, tokens} = args;
    /*
    sort the entities by 'start'
     */
    const stringFragments: string[] = [];
    for (let i = 0; i < tokens.length; i++) {
        /*
        test whether the current token belongs to the start of an entity
        if so process the entire entity and skip ahead in this loop through tokens
        to where the entity ends
         */
        let entity = entities.find(({start}) => start === i);
        if (entity) {
            /*
            handle the entire entity
             */
            let j = i;
            stringFragments.push(`<START:${entity.type}>`);
            for (j; j <= entity.end; j++) {
                stringFragments.push(tokens[j].content);
            }
            /*
            skip forward
             */
            stringFragments.push('<END>');
            i = j - 1;
        } else {
            stringFragments.push(tokens[i].content);
        }
    }
    return stringFragments.join(' ');
}

/**
 * takes string annotated with tagged entities and convert to tokens + entity objects
 * example:
 * <START:foo>The Foo<END> lorem ipsum => {entities:[{...}], token: [{content: "The", idx: 0},...]}
 *
 * this function uses a 1 pass algorithm by examining each character of the string and deciding how to process it
 *
 * I use two buffers: 1 to store the most recent token and 1 to store the most recent entity
 *
 * @param {string} text
 * @return {{tokens: Token[]; entities: Entity[]}}
 */
function textToToken(text: string): { tokens: Token[], entities: Entity[] } {
    const entities: Entity[] = [];
    const tokens: Token[] = [];
    /*
    buffer to store the current entity, including <START><END> tag
     */
    let entityBuffer: string[] = [];
    /*
    entity to store the current token
     */
    let tokenBuffer: string[] = [];
    let tokenID: number = 0;

    /**
     * test whether characters further from from i is the start of a new entity
     * @param {number} i
     * @return {boolean}
     */
    function isStartOfNewEntity(i: number): boolean {
        return text.slice(i).match(/^<START:\w+>.*?<END>/) !== null;
    }

    /**
     * test whether characters prior to mark the end of the current entity
     * @param {number} i
     * @return {boolean}
     */
    function isEndOfNewEntity(i: number): boolean {
        return entityBuffer.join('').match(/<START:\w+>.*?<END>$/) !== null;
    }

    /**
     * empties the entity buffer and create an entitiy and the corresponding
     * tokens
     */
    function extractEntityFromBuffer() {
        // extract the entity represented by the entity buffer
        const fragment = entityBuffer.join('');
        const nlpRegex = /<START:(\w+)>(.*?)<END>/g;
        const exec = nlpRegex.exec(fragment) || [];
        const [_, type, content] = exec;
        const start = tokenID;
        content
            .replace(/^\s/, '')
            .replace(/\s$/, '')
            .split(' ')
            .forEach(content => {
                tokens.push({
                    content,
                    idx: tokenID
                });
                tokenID++;
            });
        entities.push({
            id: guid(),
            start,
            type,
            end: tokenID - 1
        });
        entityBuffer = [];
    }

    function extractTokenFromBuffer() {
        if (tokenBuffer.length === 0) {
            return;
        }
        const content = tokenBuffer.join('');
        tokens.push({
            content,
            idx: tokenID
        });
        tokenID++;
        tokenBuffer = [];
    }

    for (let i = 0; i < text.length; i++) {
        let char = text.charAt(i);
        if (entityBuffer.length !== 0) {
            entityBuffer.push(char);
            if (isEndOfNewEntity(i)) {
                extractEntityFromBuffer();
            }
        } else if (isStartOfNewEntity(i)) {
            /*
            start a new entity
             */
            entityBuffer.push(char);
        } else {
            /*
            continue normal tokenization
             */
            if (char === ' ') {
                // delimiter reached, flush buffer to create a new token
                extractTokenFromBuffer();
            } else {
                // continue to populate the token buffer
                tokenBuffer.push(char);
            }
        }
    }
    extractTokenFromBuffer();
    return {
        entities,
        tokens
    };
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
