import { ErData, WageData } from "./utils/interfaces"
import fs from "fs"
import path from "path"
export class DataManager {
    wageData: WageData | null
    erData: ErData | null
    erDataPath: string
    wageDataPath: string

    constructor() {
        this.erDataPath = path.join(__dirname, "..", "data", "erClientData.json")
        this.wageDataPath = path.join(__dirname, "..", "data", "wageData.json")
        this.wageData = null
        this.erData = null
    }

    loadWageData(): WageData | null {
        try {
            const jsonData: WageData | null = require(this.wageDataPath) || null
            this.wageData = jsonData
            console.log("Data loaded, wage-data:")
            console.dir(jsonData,{depth : 0})
            return jsonData
        } catch (error) {
            return null
        }
    }

    updateWageData(data: WageData) {
        try {
            fs.writeFileSync(this.wageDataPath, JSON.stringify(data, null, 4))
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
}