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
    const initCrono = process.env.INIT_CRONO || null
    const initRenderActivator = process.env.INIT_RENDER_ACTIVATOR || null
    if (initCrono && initCrono === "true") {
        await initCronoTasks()
    }
    app.listen(port, () => {
        console.log("server listening in port:", port)
        if (initRenderActivator && initRenderActivator === "true") {
            console.log("testing...")
            renderActivator()
        }
    })
}

main()



