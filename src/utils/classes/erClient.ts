import { ErData } from "../interfaces"
import DataManager from "./dataManager"
import { createScheduledTask } from "../crono"
export default class ErClient extends DataManager {
    erData: ErData | null
    constructor() {
        super()
        this.erData = super.loadErData()
    }

    async crono () {
        createScheduledTask({
            lastUpdateDate : new Date(this.erData.updateDate),
            minTimeBetweenUpdate : 1000 * 60 * 60 * 24,
            comprobationTime : 1000 * 60 * 60,
            action : this.main,
            name : "erClient-crono-main"
        })
    }

    async main() {
        const res = await this.getErData()
        if (res.status === true) {
            this.updaeErData(res.data)
        }
    }

    async getErData(): Promise<{ status: boolean, data: ErData | null }> {
        const defaultReturn = { status: false, data: null }
        const api_key = process.env.ER_API_KEY || null
        console.log(api_key)
        if (!api_key){return defaultReturn}
        const url = `http://api.exchangeratesapi.io/v1/latest?access_key=${api_key}`
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "accept": "application/json"
                }
            })
            const fetchData = await res.json()
            if(fetchData.error){
                console.error(fetchData.error)
                return defaultReturn
            }

            const currentDate = new Date()
            const newErData: ErData = {
                updateDate: currentDate,
                data: {
                    base: fetchData.base,
                    results: fetchData.rates
                }
            }
            return { status: true, data: newErData }
        } catch (error) {
            console.log(error)
            return { status: false, data: null }
        }
    }
}



