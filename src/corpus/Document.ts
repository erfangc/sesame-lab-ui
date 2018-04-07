/**
 * Server side representation of a document
 */
export interface Document {
    Id?: string
    Content: string
    Corpus: string
    CreatedBy: string
    CreatedOn: number
    LastModified: number
    LastModifiedBy: string
}