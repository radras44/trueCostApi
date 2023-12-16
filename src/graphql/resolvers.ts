import DataManager from "../utils/classes/dataManager"

const dataManager = new DataManager
dataManager.loadErData()
dataManager.loadminimumWageData()

const resolvers = {
    Query: {
        relativeCost : (_,args) => {
            let result = null
            console.log("args:",args)
            const to = args.data.to
            const from = args.data.from
            const mount = args.data.mount
            const fromMinimum = dataManager.getMinimumWage(from)
            const toMinumum = dataManager.getMinimumWage(to)
            if(toMinumum && fromMinimum){
                result = toMinumum * (mount / fromMinimum)
            }

            return {
                status : true,
                result : result.toFixed(2)
            }
        },
        convertCurrency (_,args) {
            const usdInFromCurrency = dataManager.getCurrency(args.data.from)
            if(!usdInFromCurrency){return {status : false, error : `${args.data.from} no soportado`}}
            console.log("usd in from:",usdInFromCurrency)
            if(args.data.to == "USD"){
                return {
                    status : true,
                    result : (args.data.mount / usdInFromCurrency).toFixed(2)
                }
            }
            const usdInToCurrency = dataManager.getCurrency(args.data.to)
            if(!usdInToCurrency){return {status : false, error: `${args.data.from} no soportado`}}
            if(args.data.from == "USD"){
                return {
                    status : true,
                    result : (args.data.mount * usdInToCurrency).toFixed(2)
                }
            }
            console.log("usd in to:",usdInToCurrency)
            const usdMountValue = args.data.mount / usdInFromCurrency
            const toMountCurrency = usdMountValue * usdInToCurrency

            return {
                status : true,
                result : toMountCurrency.toFixed(2)
            }
        }
    }
}

export default resolvers