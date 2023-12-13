import { ErData } from "./utils/interfaces"
import { DataManager } from "./dataManager"
export default class ErClient extends DataManager {
    erData: ErData | null
    constructor() {
        super()
        this.erData = super.loadErData()
    }

    async crono () {
        const intervalSize = 1000 * 60 * 60
        const minTimeBetweenUpdate = 1000 * 60 * 60 * 24
        setInterval(async()=>{
            console.log("comprobacion ErClient-crono...")
            if(this.erData.updateDate){
                const updateDate = new Date(this.erData.updateDate)
                const currentDate = new Date()
                const difference = currentDate.getTime() - updateDate.getTime()
                if(difference > minTimeBetweenUpdate){
                    console.log("tiempo entre actualizacion mayor a 24 hora, realizando accion...")
                    this.main()
                }else{
                    let timeLeft = (minTimeBetweenUpdate - difference) 
                    let hours = Math.floor(timeLeft / (1000 * 60 * 60))
                    let minutes = Math.floor((timeLeft % (1000 * 60 * 60))/(1000 * 60))
                    let seconds = Math.floor((timeLeft % (1000 * 60))/ 1000)
                    console.log(`quedan ${hours} con ${minutes} y ${seconds} hasta la siguiente actualizacion`)
                }
            }
        },intervalSize)
    }

    async main() {
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



