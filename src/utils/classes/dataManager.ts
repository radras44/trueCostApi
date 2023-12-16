import { ErData, minimumWage, minimumWageData } from "../interfaces"
import fs from "fs"
import path from "path"
export default class DataManager {
    minimumWageData: minimumWageData | null
    erData: ErData | null
    erDataPath: string
    minimumWageDataPath: string
    currencyCountry : {[key : string] : string} 

    constructor() {
        this.erDataPath = path.join(__dirname, "..","..","..", "data", "erClientData.json")
        this.minimumWageDataPath = path.join(__dirname, "..","..","..", "data", "minimumWageData.json")
        this.minimumWageData = null
        this.erData = null
        this.currencyCountry = {
            CLP : "Chile",
            ARS : "Argentina"
        }
    }

    loadminimumWageData(): minimumWageData | null {
        try {
            const jsonData: minimumWageData | null = require(this.minimumWageDataPath) || null
            this.minimumWageData = jsonData
            console.log("Data loaded, wage-data:")
            console.dir(jsonData,{depth : 0})
            return jsonData
        } catch (error) {
            return null
        }
    }

    updateminimumWageData(data: minimumWageData) {
        try {
            fs.writeFileSync(this.minimumWageDataPath, JSON.stringify(data, null, 4))
            console.log("data updated, new data:")
            console.dir(data,{depth : 0})
            return data
        } catch (error) {
            console.log(error)
        }
    }

    loadErData(): ErData | null {
        try {
            const jsonData: ErData | null = require(this.erDataPath) || null
            this.erData = jsonData
            console.log("Data loaded, er-data:")
            console.dir(jsonData,{depth : 0})
            return jsonData
        } catch (error) {
            return null
        }
    }

    updaeErData(data: ErData): ErData | null {
        try {
            fs.writeFileSync(this.erDataPath, JSON.stringify(data, null, 4))
            console.log("data updated, new data:")
            console.dir(data,{depth : 0})
            return data
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getCurrency (currencyString : string) {
        const currency = this.erData.data.results[currencyString] || null
        return currency
    }

    getMinimumWage(currency : string,type : "currency" | "usd" = "currency") : number | null {
        console.log("currency:",currency)
        const country = this.currencyCountry[currency] || " "
        const minWage : minimumWage | null = this.minimumWageData.data[country] || null
        const dolarInCurrency = this.erData.data.results[currency] || null
        if(type = "usd"){
            return Number(minWage.usd)
        }
        console.log(dolarInCurrency)
        if(!minWage || !dolarInCurrency) {
            return null
        }
        return dolarInCurrency * Number(minWage.usd)
    }
}