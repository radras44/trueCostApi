import { ApolloServer, gql } from "apollo-server"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import ErClient from "./erClient"
import Extractor from "./extractor"
dotenv.config()

const graphDef = gql`
    input GetRelativeCostArgs{
        currentcy : String!
    }
    type GetRelativeCostRes{
        status : Boolean!
        message : String
        result : Int!
    }
    type Query {
        getRelativeCost(data : GetRelativeCostArgs) : GetRelativeCostRes
    }
`;

const graphRes = {
    Query: {
        getRelativeCost : (_,args) => {
            console.log("args:",args)
            return {
                status : true,
                message : "mensaje de prueba",
                result : 0
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs: graphDef,
    resolvers: graphRes,
    context: async ({ req }) => {

    }
})

export default server