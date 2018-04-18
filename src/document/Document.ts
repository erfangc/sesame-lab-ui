/**
 * Server side representation of a document
 */
export interface Document {
    id?: string
    content: string
    corpus: string
    createdOn: number
    createdBy: string
    createdByEmail: string
    createdByNickname: string
    lastModifiedOn: number
    lastModifiedBy: string
    lastModifiedByEmail: string
    lastModifiedByNickname: string
    entities?: TaggedEntity[]
}

export interface TaggedEntity {
    type: string
    value: string
}