const schema = `#graphql
    type CurrencyResponse{
        status : Boolean!
        error : String
        result : Float
    }
    input RelativeCostArgs{
        amount : Float!
        from : String!
        to : String!
    }
    type Query {
        relativeCost(data : RelativeCostArgs) : CurrencyResponse
    }

    input ConvertCurrencyInput {
        from : String!
        to : String!
        amount : Float!
    }

    type Query {
        convertCurrency (data : ConvertCurrencyInput) : CurrencyResponse
    }

    input CountryInfoInput {
        country : String!
    } 

    type CountryInfoResponse {
        status : Boolean!
        error : String
        country : String
        isoCode : String
        usdInCurrency : Float
        minimumWage : Float
        ivaGeneral : Float
    }

    type Query {
        countryInfo (data : CountryInfoInput) : CountryInfoResponse
    }
`;

export default schema