// import { ApolloServer, gql } from "apollo-server"
// import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import ErClient from "./erClient"
import Extractor from "./extractor"
dotenv.config()

// const graphDef = gql`
//     query {
//         get
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

const erClient = new ErClient()
erClient.run()
const extractor = new Extractor()
extractor.run()




