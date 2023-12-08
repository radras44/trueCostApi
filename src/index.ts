// import { ApolloServer, gql } from "apollo-server"
// import jwt from "jsonwebtoken"
// import dotenv from "dotenv"
// dotenv.config()

// const graphDef = gql`
//     query {

//     }
// `;

// const graphRes = {
//     Query: {
        
//     }
// }

// const server = new ApolloServer({
//     typeDefs: graphDef,
//     resolvers: graphRes,
//     context: async ({ req }) => {

//     }
// })
// server.listen().then((listenData) => {
//     console.log("listening in port:", listenData.port, "\n", listenData.url)
// })

import ErClient from "./getErData";
new ErClient()



