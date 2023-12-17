const schema =`#graphql
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
`;

export default schema