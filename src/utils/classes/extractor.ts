import puppeteer, { Browser, Page } from "puppeteer";
import { minimumWage,minimumWageData} from "../interfaces";
import DataManager from "./dataManager";
import { createScheduledTask } from "../crono";
export default class Extractor extends DataManager {
    browser: Browser
    page: Page
    constructor() {
        super()
        this.minimumWageData = this.loadminimumWageData()
    }

    async crono () {
        createScheduledTask({
            lastUpdateDate : new Date(this.minimumWageData.updateDate),
            minTimeBetweenUpdate : 1000 * 60 * 60 * 24 * 30,
            comprobationTime : 1000 * 60 * 60 * 24,
            action : this.main
        })
    }

    async main() {
        await this.extractWageData()
    }

    async initPuppeteer() {
        this.browser = await puppeteer.launch({ headless: false })
        this.page = await this.browser.newPage()
    }

    async closePuppeteer() {
        await this.browser.close()
    }

    async extractIVAdata () {
        const url = "https://datosmacro.expansion.com/impuestos/iva"
    }

    async extractWageData() {
        await this.initPuppeteer()
        const minimumWage_url = `https://es.wikipedia.org/wiki/Plantilla:Salarios_m%C3%ADnimos_en_Latinoam%C3%A9rica`
        await this.page.goto(minimumWage_url)
        const rowsSelector : string = "table.wikitable tbody tr"
        await this.page.waitForSelector(rowsSelector)

        interface evReturn {
            status : boolean,
            data : {[key : string] : minimumWage} | null
            message? : string
        }
        
        const data = await this.page.evaluate((rowsSelector) : evReturn=>{
            const defaultReturn = {status : false,data : null}
            function cleanText (str:string){
                const regex = /[\u00a0\u200B]/g
                return str.replace(regex," ").trim()
            }
            const keys = ["country","usd","local"]
            const minimumWageSet : {[key : string] : minimumWage} = {}
            const rows : HTMLTableRowElement[] | null = Array.from(document.querySelectorAll(rowsSelector)) || null
            if(!rows) {return {...defaultReturn,message : "rows es null"}}

            for(let i = 0; i < rows.length ; i++){
                const minimumWage : minimumWage = {
                    country : null,
                    usd : null,
                    local : null
                }
                const row = rows[i]
                if(row.classList.contains("sortbottom")){
                    continue
                }
                const cols : HTMLTableCellElement[] | null = Array.from(row.querySelectorAll("td")) || null
                if(!cols){return {...defaultReturn,message : "cols es null"}}

                for(let j = 0 ; j < cols.length ; j++){
                    const col = cols[j]
                    console.log(col)
                    let text : string | null = null
                    text = col.textContent.trim() || null
                    const key = keys[j]
                    if(key && text){
                        if(j === 0){
                            const wordArr : Set<string> = new Set([]) 
                            const splited = cleanText(text).split(" ")
                            splited.forEach((word)=>{
                                    wordArr.add(word)
                            })
                            text = Array.from(wordArr).join(" ")
                        }
                        if(j === 2){
                            text = cleanText(text)
                        }
                        minimumWage[key] = text
                    }
                }
                if(minimumWage.country){
                    minimumWageSet[minimumWage.country] = minimumWage
                }
            }

            return {status : true,data : minimumWageSet,message :"no hubo problemas en la recoleccion"}
        },rowsSelector)
        if(data){
            super.updateminimumWageData({
                updateDate : new Date(),
                data : data.data
            })
        }
        await this.closePuppeteer()
    }
}