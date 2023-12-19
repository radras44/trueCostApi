import puppeteer, { Browser, Page } from "puppeteer";
import { Iva, IvaData, minimumWage, minimumWageData } from "../interfaces";
import DataManager from "./dataManager";
import { createScheduledTask } from "../crono";
export default class Extractor extends DataManager {
    browser: Browser
    page: Page
    ivaURL : string | null
    minimumWageURL : string | null
    constructor() {
        super()
        this.config()
        this.minimumWageData = this.loadminimumWageData()
        this.ivaData = this.loadIvaData()
    }

    async crono() {
        createScheduledTask({
            lastUpdateDate: new Date(this.minimumWageData.updateDate),
            minTimeBetweenUpdate: 1000 * 60 * 60 * 24 * 30,
            comprobationTime: 1000 * 60 * 60 * 24,
            action: this.main,
            name : "extractor-crono-main"
        })
    }

    async main () {
        await this.extractIvaData()
        await this.extractWageData()
    }

    config () {
        this.ivaURL = process.env.IVA_URL || null
        this.minimumWageURL = process.env.MINIMUM_WAGE_URL || null
        if(!this.ivaURL || !this.minimumWageURL){
            throw new Error("Environment variables in the extractor are undefined.")
        }
    }

    async initPuppeteer(headless: boolean = true) {
        this.browser = await puppeteer.launch({ headless: headless })
        this.page = await this.browser.newPage()
    }

    async closePuppeteer() {
        await this.browser.close()
    }

    async extractWageData() {
        await this.initPuppeteer(true)
        await this.page.goto(this.minimumWageURL)
        const rowsSelector: string = "table.wikitable tbody tr"
        await this.page.waitForSelector(rowsSelector)

        interface evReturn {
            status: boolean,
            data: { [key: string]: minimumWage } | null
            message?: string
        }

        const data = await this.page.evaluate((rowsSelector): evReturn => {
            const defaultReturn = { status: false, data: null }
            function cleanText(str: string) {
                const regex = /[\u00a0\u200B]/g
                return str.replace(regex, " ").trim()
            }
            const keys = ["country", "usd", "local"]
            const minimumWageSet: { [key: string]: minimumWage } = {}
            const rows: HTMLTableRowElement[] | null = Array.from(document.querySelectorAll(rowsSelector)) || null
            if (!rows) { return { ...defaultReturn, message: "rows es null" } }

            for (let i = 0; i < rows.length; i++) {
                const minimumWage: minimumWage = {
                    country: null,
                    usd: null,
                    local: null
                }
                const row = rows[i]
                if (row.classList.contains("sortbottom")) {
                    continue
                }
                const cols: HTMLTableCellElement[] | null = Array.from(row.querySelectorAll("td")) || null
                if (!cols) { return { ...defaultReturn, message: "cols es null" } }

                for (let j = 0; j < cols.length; j++) {
                    const col = cols[j]
                    let text: string | null = null
                    text = col.textContent.trim() || null
                    const key = keys[j]
                    if (key && text) {
                        if (j === 0) {
                            const wordArr: Set<string> = new Set([])
                            const splited = cleanText(text).split(" ")
                            splited.forEach((word) => {
                                wordArr.add(word)
                            })
                            text = Array.from(wordArr).join(" ")
                        }
                        if (j === 2) {
                            text = cleanText(text)
                        }
                        minimumWage[key] = text
                    }
                }
                if (minimumWage.country) {
                    minimumWageSet[minimumWage.country] = minimumWage
                }
            }

            return { status: true, data: minimumWageSet, message: "no hubo problemas en la recoleccion" }
        }, rowsSelector)
        if (data) {
            super.updateminimumWageData({
                updateDate: new Date(),
                data: data.data
            })
        }
        await this.closePuppeteer()
    }
    async extractIvaData() {
        const trSelector = "#tb1 tbody tr"
        await this.initPuppeteer(true)
        await this.page.setRequestInterception(true);

        this.page.on('request', (request) => {
            if (
                ['image', 'stylesheet', 'font'].includes(request.resourceType()) ||
                request.url().endsWith('.png') || request.url().endsWith('.jpg')
            ) {
                request.abort();
            } else {
                request.continue();
            }
        });
        await this.page.goto(this.ivaURL)
        await this.page.waitForSelector(trSelector)

        interface EvReturn {
            status: boolean,
            result: { [key: string]: Iva }
        }

        const data = await this.page.evaluate((trSelector) => {
            const allIva: { [key: string]: Iva } = {}
            const defaultReturn: EvReturn = { status: false, result: {} }
            const rows: HTMLTableRowElement[] | null = Array.from(document.querySelectorAll(trSelector)) || null

            const layout: Iva = { country: null, date: null, general: null }
            if (!rows) { return defaultReturn }
            for (let i = 0; i < rows.length; i++) {
                const ivaObj: Iva = { ...layout }
                const row: HTMLTableRowElement = rows[i]
                const cols: HTMLTableCellElement[] | null = Array.from(row.querySelectorAll("td")) || null
  
                if (!cols) { return defaultReturn }
                for (let j = 0; j < cols.length; j++) {
                    const col: HTMLTableCellElement = cols[j]
                    switch (j) {
                        case 0: ivaObj["country"] = col.textContent.split(" ")[0].trim() || null
                            break;

                        case 1: ivaObj["date"] = col.textContent.trim() || null
                            break;

                        case 4: ivaObj["general"] = parseFloat((Number(col.textContent.split(",")[0].trim()) / 100).toFixed(2)) || null
                            break;
                    }
                }

                if (ivaObj.country && ivaObj.general) {
                    allIva[ivaObj.country] = ivaObj
                }

            }
            return { status: true, result: allIva }
        }, trSelector)
        
        if (data.status === true) {
            const ivaData: IvaData = {
                updateDate: new Date(),
                data: data.result
            }
            this.updateIvaData(ivaData)
        }
        await this.closePuppeteer()
    }
}