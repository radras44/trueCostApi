import { ErData } from "../interfaces"
import DataManager from "./dataManager"
import { createScheduledTask } from "../crono"
export default class ErClient extends DataManager {
    erData: ErData | null
    baseURL : string | null
    apiKey : string | null
    constructor() {
        super()
        this.config()
        this.erData = super.loadErData()
    }

    config() {
        this.baseURL=process.env.ER_URL || null
        this.apiKey=process.env.ER_API_KEY || null
        if(!this.baseURL || !this.apiKey){
            throw new Error("Environment variables in the ErClient are undefined.")
        }
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
        const url = `${this.baseURL}?access_key=${this.apiKey}`
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
            console.error(error)
            return { status: false, data: null }
        }
    }
}



