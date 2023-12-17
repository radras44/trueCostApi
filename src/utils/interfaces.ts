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

export interface Iva {
    country : string | null
    date : string | null
    general : number | null
}

export interface IvaData {
    updateDate : Date,
    data : {[key : string] : Iva}
}

export interface GQLSchema {
    queries : {[key : string] : Function}
    mutations : {[key : string] : Function}
    querySchema : string
    mutationSchema : string
    entitySchema : string
}
