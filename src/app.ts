import express from "express"
import server from "./apollo"

const app = express()

app.use((req,res,next)=>{
    const auth = req.headers.authorization || null
    const apiKey = process.env.API_KEY || null
    console.log("auth:",auth)
    console.log("apikey",apiKey)
    if(!apiKey){
        return res.status(500).json({error : "server error, try again later"})
    }
    if(auth !== apiKey){
        return res.status(401).json({
            error : "not authorized"
        })
    }
    return next()
})

export default app