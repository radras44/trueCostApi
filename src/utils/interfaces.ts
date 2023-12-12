export interface ErFetchResObj {
    base: string,
    results: { [key: string]: number }
}

export interface ErData {
    updateDate: Date
    data: ErFetchResObj
}

export interface WageProps {
    country : string,
    minimumWage : string | null,
    anualNominalUS : string | null,
    anualPPPInt : string | null,
    hourPerWeek : string | null,
    hourlyNominalUS : string | null,
    hourlyPPPInt : string | null,
    gdpPerCapital : string | null,
    EffectivePer : string | null
}

export interface WagePropsSet {
    [key : string] : WageProps
}

export interface WageData {
    updateDate : Date
    data : WagePropsSet
}

export interface GQLSchema {
    queries : {[key : string] : Function}
    mutations : {[key : string] : Function}
    querySchema : string
    mutationSchema : string
    entitySchema : string
}
