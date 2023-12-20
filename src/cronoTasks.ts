import ErClient from "./utils/classes/erClient"
import Extractor from "./utils/classes/extractor"

const extractor = new Extractor()
const erClient = new ErClient()

export default async function initCronoTasks () {
    extractor.crono()
    erClient.crono()
}