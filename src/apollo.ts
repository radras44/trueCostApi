import { ApolloServer } from "apollo-server-express"

import resolvers from "./graphql/resolvers";
import schema from "./graphql/schema";

function verifyAuth (auth : string | null) {
    if(!auth){
        return false
    }

    if(auth == process.env.API_KEY){
        return true        
    }

    return false
}

const server = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers,
})

export default server