export interface GQLSchema {
    queries : {[key : string] : Function}
    mutations : {[key : string] : Function}
    querySchema : string
    mutationSchema : string
    entitySchema : string
}