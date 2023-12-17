import { ApolloServer } from "apollo-server-express"

import resolvers from "./graphql/resolvers";
import schema from "./graphql/schema";

const server = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers,
})

export default server