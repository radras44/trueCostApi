import path from "path"
import express from "express"
import rateLimit from "express-rate-limit"
import cors from "cors"
import fs from "fs"
import MarkdounIt from "markdown-it"
const app = express()
const md = MarkdounIt({
    breaks : false
}) 
app.use(cors())
app.use(rateLimit({
    windowMs : 1000 * 60,
    max : 30,
    message : "to many request, try later"
}))

const staticsPath = path.join(path.resolve(__dirname),"..", "src","static")

app.use("/static",express.static(staticsPath))

app.use(["/graphql"],(req,res,next)=>{
    if(req.method === "GET"){
        return next()
    }
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

// app.get("/",async(req,res)=>{
//     const rootPath = path.resolve(__dirname)
//     const htmlFile = await fs.readFileSync(path.join(rootPath,"..","src","static","index.html"),{encoding : "utf-8"}) || null
//     const readmeFile = await fs.readFileSync(path.join(rootPath,"..","README.md"),{encoding : "utf-8"}) || null

//     if(!htmlFile || !readmeFile){
//         return res.status(500).json({error : "error del servidor"})
//     }
//     const markedReadme = md.render(readmeFile)
//     if(!markedReadme){
//         return res.status(500).json({error : "error del servidor, no se pudo cargar la documentacion"})
//     }
//     const processedHtml =  htmlFile.replace("readme.md",markedReadme)

//     return res.status(200).send(processedHtml)
// })

export default app