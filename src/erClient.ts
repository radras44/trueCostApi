import { ErData } from "./utils/interfaces"
import { DataManager } from "./dataManager"
export default class ErClient extends DataManager {
    data: ErData | null
    constructor() {
        super()
        this.data = super.loadErData()
    }

    async run() {
        const res = await this.getErData()
        if (res.status) {
            this.updaeErData(res.data)
        }
    }

    async getErData(): Promise<{ status: boolean, data: ErData | null }> {
        const api_key = process.env.ER_API_KEY || null
        console.log("utilizando api key =>", api_key)
        if (!api_key) {
            return { status: false, data: null }
        }
        try {
            const res = await fetch("https://api.fastforex.io/fetch-all?api_key=" + api_key, {
                method: "GET",
                headers: {
                    "accept": "application/json"
                }
            })
            console.log(res)
            const fetchData = await res.json()
            const currentDate = new Date()
            const newErData: ErData = {
                updateDate: currentDate,
                data: {
                    base: fetchData.base,
                    results: fetchData.results
                }
            }
            return { status: true, data: newErData }
        } catch (error) {
            console.log(error)
            return { status: false, data: null }
        }
    }
}



