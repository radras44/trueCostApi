import { ErData, WageData } from "./utils/interfaces"
import fs from "fs"
import path from "path"
export class DataManager {
    wageDataset: WageData | null
    erData: ErData | null
    erDataPath: string
    wageDatasetPath: string

    constructor() {
        this.erDataPath = path.join(__dirname, "..", "data", "erClientData.json")
        this.wageDatasetPath = path.join(__dirname, "..", "data", "wageData.json")
        this.wageDataset = null
        this.erData = null
    }

    loadWageDataset(): WageData | null {
        try {
            const jsonData: WageData | null = require(this.wageDatasetPath) || null
            this.wageDataset = jsonData
            console.log("Data loaded, loaded Data\n", jsonData)
            return jsonData
        } catch (error) {
            return null
        }
    }

    updateWageDataset(data: WageData) {
        try {
            fs.writeFileSync(this.wageDatasetPath, JSON.stringify(data, null, 4))
        } catch (error) {
            console.log(error)
        }
    }

    loadErData(): ErData | null {
        try {
            const filePath = path.join()
            const jsonData: ErData | null = require(filePath) || null
            this.erData = jsonData
            console.log("Data loaded, loaded Data\n", jsonData)
            return jsonData
        } catch (error) {
            return null
        }
    }

    updaeErData(data: ErData): ErData | null {
        try {
            fs.writeFileSync(this.erDataPath, JSON.stringify(data, null, 4))
            console.log("data updated, new data:\n", data)
            return data
        } catch (error) {
            console.log(error)
            return null
        }
    }
}