import server from "./apollo"
import ErClient from "./erClient"
import Extractor from "./extractor"

const extractor = new Extractor()
const erClient = new ErClient()
server.listen().then((listenData) => {
    console.log("listening in port:", listenData.port, "\n", listenData.url)
})
extractor.crono()
erClient.crono()


