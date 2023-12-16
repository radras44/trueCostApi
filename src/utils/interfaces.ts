export interface ErFetchResObj {
    base: string,
    results: { [key: string]: number }
}

export interface ErData {
    updateDate: Date
    data: ErFetchResObj
}

export interface minimumWage {
    country : string
    usd : string | null
    local : string | null
}

export interface minimumWageData {
    updateDate : Date
    data : {[key : string] : minimumWage}
}

export interface GQLSchema {
    queries : {[key : string] : Function}
    mutations : {[key : string] : Function}
    querySchema : string
    mutationSchema : string
    entitySchema : string
}
