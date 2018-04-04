import * as React from 'react';
import {Menu} from 'semantic-ui-react';

interface Props {
    annotatedText: string
}

interface Token {
    idx: number
    content: string
}

interface Entity {
    id: string
    type: string
    start: number
    end: number
}

interface State {
    entityUnderEdit: Entity | undefined
    tokens: Token[]
    entities: Entity[]
    menu: { x: number, y: number } | undefined
}

export class TextTagger extends React.Component<Props, State> {

    getInitialState(props: Props) {
        /*
           convert annotated text to state
            */
        const {annotatedText} = props;
        /*
        convert annotated string into its span representation
         */
        const untaggedFragments = annotatedText.split(/<START:\w+>.*?<END>/g).filter(fragment => fragment !== '');
        const taggedFragments = annotatedText.match(/<START:(\w+)>(.*?)<END>/g) || [];

        const tokens: Token[] = [];
        const entities: Entity[] = [];

        /*
        determine which comes first, the tagged or untagged fragments
         */
        let first = untaggedFragments;
        let second = taggedFragments;
        if (annotatedText.startsWith('<START')) {
            first = taggedFragments;
            second = untaggedFragments;
        }
        let tokenIdx: number = 0;

        function processFragment(fragment: string) {
            if (!fragment) {
                return;
            }
            if (fragment.startsWith('<START')) {
                const nlpRegex = /<START:(\w+)>(.*?)<END>/g;
                const exec = nlpRegex.exec(fragment) || [];
                const [_, type, content] = exec;
                const start = tokenIdx;
                content
                    .replace(/^\s/, '').replace(/\s$/, '')
                    .split(' ')
                    .forEach(content => {
                        tokens.push({
                            content,
                            idx: tokenIdx
                        });
                        tokenIdx++;
                    });
                entities.push({
                    id: guid(),
                    start,
                    type,
                    end: tokenIdx - 1
                });
            } else {
                fragment
                    .replace(/^\s/, '')
                    .replace(/\s$/, '')
                    .split(' ')
                    .forEach(content => {
                        tokens.push({
                            content,
                            idx: tokenIdx
                        });
                        tokenIdx++;
                    });
            }
        }

        for (let i = 0; i < first.length; i++) {
            processFragment(first[i]);
            processFragment(second[i]);
        }
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
    });

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
    });

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

    resolveTokenClass = (token: Token): string | undefined => {
        // if the given token is currently edited, its class belongs that that
        const {entityUnderEdit} = this.state;
        if (entityUnderEdit !== undefined && token.idx >= entityUnderEdit.start && token.idx <= entityUnderEdit.end) {
            return entityUnderEdit.type;
        } else {
            const resolvedEntity = this.resolveTokenEntity(token);
            if (resolvedEntity !== undefined) {
                /*
                if the resolved entity is the one being edited, also return undefined
                because this implies the user has de-selected the token
                 */
                if (entityUnderEdit !== undefined && resolvedEntity.id === entityUnderEdit.id) {
                    return undefined;
                }
                return resolvedEntity.type;
            } else {
                return undefined;
            }
        }
    };

    render(): React.ReactNode {
        const {tokens, menu} = this.state;
        const spans = tokens
            .map((token) => {
                    const {idx, content} = token;
                    return (
                        <React.Fragment key={idx}>
                            <span
                                key={idx}
                                className={this.resolveTokenClass(token)}
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
                                <Menu.Item onClick={() => this.confirmEdit('firm')}>Firm</Menu.Item>
                                <Menu.Item onClick={() => this.confirmEdit('family')}>Family</Menu.Item>
                                <Menu.Item
                                    onClick={() => {
                                        this.setState(() => ({menu: undefined}));
                                        this.cancelEdit();
                                    }}
                                >
                                    Cancel
                                </Menu.Item>
                                <Menu.Item
                                    color={"red"}
                                    icon={"remove"}
                                    onClick={() => this.deleteEntity()}
                                >
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

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
