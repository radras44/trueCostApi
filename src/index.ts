import dotenv from "dotenv"
dotenv.config()
import app from "./app"
import initCronoTasks from "./cronoTasks"
import server from "./apollo"
const port = process.env.PORT || 3000 || 80

async function main () {
    await server.start()
    server.applyMiddleware({app})
    await initCronoTasks()
    app.listen(port,()=>{
        console.log("server listening in port:",port)
    })
}

main()



