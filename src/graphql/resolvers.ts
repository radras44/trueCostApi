import DataManager from "../utils/classes/dataManager"

const dataManager = new DataManager
dataManager.loadErData()
dataManager.loadminimumWageData()
dataManager.loadIvaData()

const resolvers = {
    Query: {
        relativeCost : (_,args) => {
            console.log("args:",args)
            const {from,to,amount} = args.data
            const fromMinimum = dataManager.getMinimumWage(from)
            const toMinumum = dataManager.getMinimumWage(to)
            const fromIva = dataManager.getIva(from)
            const toIva = dataManager.getIva(to)
            if(!fromMinimum || !fromIva){
                return {status: false,error : `${from} is not supported`}
            }
            if(!toMinumum || !toIva){
                return {status: false,error : `${to} is not supported`}
            }
            
            const result = (toMinumum*(1-toIva)) * ((amount/(fromMinimum*(1-fromIva))))
            return {
                status : true,
                result : result,
            }
        },
        convertCurrency (_,args) {
            const convertion = dataManager.convert(args.data.amount,args.data.from,args.data.to)
            console.log(convertion)
            if(!convertion.error){
                return {
                    status : true,
                    result : convertion.result
                }
            }else{
                return {
                    status : "false",
                    message : ""
                }
            }
        },
        countryInfo : (_,args) => {
            const currency = dataManager.searchCountry(args.data.country) || null
            console.log(currency)
            if(currency == null){return {status : false,error : `${args.data.country} not found or not supported`}}
            const minimumWage = dataManager.getMinimumWage(currency) || null
            const ivaGeneral = dataManager.getIva(currency) || null
            const usdInCurrency = dataManager.convert(1,"USD",currency) || null
            const response = {
                status : true,
                country : args.data.country,
                isoCode : currency,
                usdInCurrency : usdInCurrency.result || null,
                minimumWage : minimumWage,
                ivaGeneral : ivaGeneral 
            }
            console.log(response)
            return response
        }
    }
}

export default resolvers