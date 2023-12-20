import dotenv from "dotenv"
dotenv.config()

import app from "./app"
import server from "./apollo"
import initCronoTasks from "./cronoTasks"
import { renderActivator } from "./test"

const port = process.env.PORT || 3000 || 80

async function main() {
    await server.start()
    server.applyMiddleware({ app })
    await initCronoTasks()
    app.listen(port, () => {
        console.log("server listening in port:", port)
        if(process.env.PRODUCTION){
            console.log("testing...")
            renderActivator()
        }
    })
}

main()



