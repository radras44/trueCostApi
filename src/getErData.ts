import fs from "fs"
import path from "path"
interface ErFetchResObj {
    base : string,
    results : {[key : string] : number}
}

interface ErData {
    lastFetch : {
        second : number,
        minute : number,
        hour : number
    },
    data : ErFetchResObj
}

export default class ErClient {
    data : ErData | null
    dataPath : string
    constructor () {
        this.dataPath = path.join(__dirname,"..","data","erClientData.json")
        this.data = this.loadData()
        console.log(this.data)
        this.updateData({
            lastFetch : {
                second : 20,
                minute : 30,
                hour : 20
            },
            data : {
                base : "USD",
                results : {
                    CLP : 876.5,
                    ARS : 366.9544
                }
            }
        })
    }

    private updateData (updatedData : ErData) {
        this.data = updatedData
        fs.writeFileSync(this.dataPath,JSON.stringify(updatedData,null,4))
        console.log("data updated, new data:\n",this.data)
    }

    private loadData () : ErData | null {
        try {
            const jsonData : ErData = require(this.dataPath) 
            console.log(jsonData)
            return jsonData
        } catch (error) {
            return null
        }
    }

    private getExchanges () {
        const api_key = process.env.ER_API_KEY || null
        console.log(api_key)
        if (!api_key) {
            return { status: false }
        }
        return fetch("https://api.fastforex.io/fetch-all?api_key=" + api_key, {
            method: "GET",
            headers: {
                "accept": "application/json"
            }
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                return { status: true }
            })
            .catch((err) => {
                console.error("Server error", err)
                return { status: false }
            })
    }
}



