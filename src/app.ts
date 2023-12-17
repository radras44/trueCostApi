import express from "express"
import rateLimit from "express-rate-limit"

const app = express()


app.use(rateLimit({
    windowMs : 1000 * 60,
    max : 50,
    message : "to many request, try later"
}))
app.use((req,res,next)=>{
    const auth = req.headers.authorization || null
    const apiKey = process.env.API_KEY || null
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