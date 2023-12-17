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

        }
    }
}

export default resolvers