import puppeteer, { Browser, Page } from "puppeteer";
import { WageData, WageProps, WagePropsSet } from "./utils/interfaces";
import { DataManager } from "./dataManager";
export default class Extractor extends DataManager {
    browser: Browser
    page: Page
    constructor() {
        super()
    }

    async run() {
        await this.minimumWageExtractor()
    }

    async initPuppeteer() {
        this.browser = await puppeteer.launch({ headless: true })
        this.page = await this.browser.newPage()
    }

    async closePuppeteer() {
        await this.browser.close()
    }

    async minimumWageExtractor() {
        await this.initPuppeteer()
        const minimumWage_url = `https://en.wikipedia.org/wiki/List_of_countries_by_minimum_wage`
        console.log("navegando")
        await this.page.goto(minimumWage_url)
        const trSelector = "table.wikitable tbody tr"
        console.log("esperando selector")
        await this.page.waitForSelector(trSelector)
    
        console.log("iniciando evaluacion")
        const data : {status : boolean,result : WagePropsSet} = await this.page.evaluate((trSelector): {
            status: boolean, 
            result: WagePropsSet
        } => {
            const keys = [
                "country",
                "minimumWage",
                "anualNominalUS",
                "anualPPPInt",
                "hourPerWeek",
                "hourlyNominalUS",
                "hourlyPPPInt",
                "gdpPerCapital",
                "EffectivePer"
            ]
            console.log("encontrando filas")
            const tRows = Array.from(document.querySelectorAll(trSelector)) || []
            if (!(tRows.length > 0)) {
                return { status: false, result: null }
            }
            let cell: HTMLTableCellElement | null = null
            let key: string
            
            let wagePropsSet : WagePropsSet = {}

            console.log("extrayendo informacion de filas")
            tRows.forEach((row: HTMLTableRowElement) => {
                let rowData: WageProps = {
                    country : null,
                    minimumWage : null,
                    anualNominalUS : null,
                    anualPPPInt : null,
                    hourPerWeek : null,
                    hourlyNominalUS : null,
                    hourlyPPPInt : null,
                    gdpPerCapital : null,
                    EffectivePer : null
                }
                const cells = Array.from(row.querySelectorAll("td")) || []
                for (let i = 0; i < keys.length; i++) {
                    cell = cells[i] || null
                    key = keys[i]
                    if (cell && key) {
                        rowData[key] = cell.innerText.trim()
                    }else{
                        rowData[key] = null
                    }
                }
                if(rowData.country){
                    wagePropsSet[rowData.country] = rowData
                }
            })
            return { status: true, result: wagePropsSet }

        }, trSelector)
        if(data.status === true){
            const currentDate = new Date()
            const wageData : WageData = {
                updateDate : currentDate,
                data : data.result
            }
            await super.updateWageDataset(wageData)
        }
        await this.closePuppeteer()
    }
}