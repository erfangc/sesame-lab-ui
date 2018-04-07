import {guid} from '../utils/AppUtils';

export interface Token {
    idx: number
    content: string
}

export interface Entity {
    id: string
    type: string
    start: number
    end: number
}

export function stripNERAnnotations(text: string): string {
    return text.replace(/<START:\w+>\s(.*?)<END>/g, '$1');
}

/**
 * convert tokens and entities objects to string
 * @return {string}
 * @param args
 */
export function tokenToText(args: { tokens: Token[], entities: Entity[] }): string {
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
export function textToToken(text: string): { tokens: Token[], entities: Entity[] } {
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
        const exec = /<START:(\w+)>(.*?)<END>/g.exec(fragment) || [];
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
