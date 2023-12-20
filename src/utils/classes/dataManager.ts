import { ErData, IvaData, minimumWage, minimumWageData } from "../interfaces"
import fs from "fs"
import path from "path"
export default class DataManager {
    minimumWageData: minimumWageData | null
    erData: ErData | null
    ivaData: IvaData | null
    erDataPath: string
    minimumWageDataPath: string
    ivaDataPath: string
    currencyCountry: { [key: string]: string }

    constructor() {
        this.erDataPath = path.join(__dirname, "..", "..", "..", "data", "erClientData.json")
        this.minimumWageDataPath = path.join(__dirname, "..", "..", "..", "data", "minimumWageData.json")
        this.ivaDataPath = path.join(__dirname, "..", "..", "..", "data", "ivaData.json")
        this.minimumWageData = null
        this.erData = null
        this.ivaData = null
        this.currencyCountry = {
            'CLP': 'Chile',
            'ARS': 'Argentina',
            'MXN': 'México',
            'COP': 'Colombia',
            'PEN': 'Perú',
            'HNL': 'Honduras',
            'GTP': 'Guatemala',
            'EUR': 'España',
            'USD': 'Estados Unidos',
            'CAD': 'Canadá',
            'GBP': 'Reino Unido',
            'JPY': 'Japón',
            'CNY': 'China',
            'AUD': 'Australia',
            'NZD': 'Nueva Zelanda',
            'INR': 'India',
            'RUB': 'Rusia',
            'CHF': 'Suiza',
            'KRW': 'Corea del Sur',
            'ZAR': 'Sudáfrica',
            'BRL': 'Brasil',
            'TRY': 'Turquía',
            'SEK': 'Suecia',
            'NOK': 'Noruega',
            'DKK': 'Dinamarca',
            'SGD': 'Singapur',
            'HKD': 'Hong Kong',
            'AED': 'Emiratos Árabes Unidos',
            'SAR': 'Arabia Saudita',
            'QAR': 'Catar',
            'KWD': 'Kuwait',
            'MYR': 'Malasia',
            'THB': 'Tailandia',
            'PHP': 'Filipinas',
            'IDR': 'Indonesia',
            'VND': 'Vietnam',
            'BHD': 'Bahréin',
            'OMR': 'Omán',
            'IQD': 'Irak',
            'ILS': 'Israel',
            'PLN': 'Polonia',
            'CZK': 'República Checa',
            'HUF': 'Hungría',
            'RON': 'Rumania',
            'ZMW': 'Zambia',
            'NGN': 'Nigeria',
            'EGP': 'Egipto',
            'DZD': 'Argelia',
            'TND': 'Túnez',
            'MAD': 'Marruecos',
            'UGX': 'Uganda',
            'KES': 'Kenia',
            'TZS': 'Tanzania',
            'GHS': 'Ghana',
            'BGN': 'Bulgaria',
            'HRK': 'Croacia',
            'ISK': 'Islandia',
            'LKR': 'Sri Lanka',
            'BDT': 'Bangladesh',
            'MMK': 'Myanmar',
            'LBP': 'Líbano',
            'JOD': 'Jordania',
            'BYN': 'Bielorrusia',
            'AMD': 'Armenia',
            'GEL': 'Georgia',
            'ALL': 'Albania',
            'MDL': 'Moldavia',
            'MKD': 'Macedonia del Norte',
            'XAF': 'CFA Central',
            'XOF': 'CFA Occidental',
            'KZT': 'Kazajistán',
            'UZS': 'Uzbekistán',
            'TMT': 'Turkmenistán',
            'TJS': 'Tayikistán',
            'AZN': 'Azerbaiyán',
            'MNT': 'Mongolia',
            'AFA': 'Afganistán'
        }
    }

    searchCountry (country : string) {
        for(const key in this.currencyCountry){
            if(this.currencyCountry[key] == country){
                return key
            }
        }
        return null
    }

    loadminimumWageData(): minimumWageData | null {
        try {
            const jsonData: minimumWageData | null = require(this.minimumWageDataPath) || null
            this.minimumWageData = jsonData
            console.log("Data loaded, minimumWage-data:")
            console.dir(jsonData, { depth: 0 })
            return jsonData
        } catch (error) {
            return null
        }
    }

    updateminimumWageData(data: minimumWageData) {
        try {
            fs.writeFileSync(this.minimumWageDataPath, JSON.stringify(data, null, 4))
            console.log("data updated, minimumWage-data:")
            console.dir(data, { depth: 0 })
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
            console.dir(jsonData, { depth: 0 })
            return jsonData
        } catch (error) {
            return null
        }
    }

    updaeErData(data: ErData): ErData | null {
        try {
            fs.writeFileSync(this.erDataPath, JSON.stringify(data, null, 4))
            console.log("data updated, er-data:")
            console.dir(data, { depth: 0 })
            return data
        } catch (error) {
            console.log(error)
            return null
        }
    }

    loadIvaData() {
        try {
            const jsonData: IvaData | null = require(this.ivaDataPath) || null
            this.ivaData = jsonData
            console.log("Data loaded, iva-data:")
            console.dir(jsonData, { depth: 0 })
            return jsonData
        } catch (error) {
            return null
        }
    }

    updateIvaData(data: IvaData) {
        try {
            fs.writeFileSync(this.ivaDataPath, JSON.stringify(data, null, 4))
            console.log("data updated, iva-data:")
            console.dir(data, { depth: 0 })
            return data
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getEr(currencyString: string) : number | null {
        const currency = this.erData.data.results[currencyString] || null
        return currency
    }

    getIva(currencyString : string) :  number | null {
        const country = this.currencyCountry[currencyString] || " "
        const iva = this.ivaData.data[country] || null
        if(!iva){return null}
        return iva.general
    }

    convert(amount : number,from : string,to : string) : {error : null | string,result : number | null} {
        const base = this.erData.data.base || "EUR"
        const baseInFrom = this.getEr(from)
   
        if (!baseInFrom) {return {error : `${from} is not supported`,result : null}}
        if (to == base) {
            return {error : null,result : amount / baseInFrom}
        }
        const baseInTo = this.getEr(to)

        if (!baseInTo) { return {error : `${to} is not supported`,result : null} }
        if (from == base) {
            return {error : null,result : amount * baseInTo}
        }
 
        const result = (amount / baseInFrom) * baseInTo

        return {
            result : result,
            error : null
        }
    }

    getMinimumWage(currency: string): number | null {
        if (!this.minimumWageData) { throw Error("minimum wage data has not been loaded") }
        const country = this.currencyCountry[currency] || " "
        const minWageObj: minimumWage | null = this.minimumWageData.data[country] || null
        if(!minWageObj){return null}
        const minWageValue = this.convert(parseFloat(minWageObj.usd),"USD",currency)
        if(!minWageValue.error){
            return minWageValue.result
        }else{
            return null
        }
    }
}