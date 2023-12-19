import { fetchingTest } from "./test"
import ErClient from "./utils/classes/erClient"
import Extractor from "./utils/classes/extractor"
import { createScheduledTask } from "./utils/crono"

const extractor = new Extractor()
const erClient = new ErClient()

export default async function initCronoTasks () {
    await fetchingTest()
    console.log("fetching test")
    setInterval(()=>{
        fetchingTest()
        console.log("fetching test")
    },1000 * 60 * 14)
    extractor.main()
    erClient.main()
    extractor.crono()
    erClient.crono()
}