import dotenv from "dotenv"
dotenv.config()
async function fetching() {
    const query = `
    query {
        relativeCost (data : {
            amount : 1200
            from : "ARS"
            to : "CLP"
        })
        {status,result,error}
    }
    `
    try {
        const res = await fetch("https://truecostapi.onrender.com/graphql",{
            method : "POST",
            body : JSON.stringify({query}),
            headers : {
                authorization : process.env.API_KEY,
                "Content-Type" : "application/json"
            }
        })
        const json = await res.json()
        const data = json.data
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}

fetching()