import dotenv from "dotenv"
dotenv.config()
export async function fetchingTest() : Promise<void> {
    const query = `
    query {
        countryInfo (data : {
            country : "Chile"
        })
        {status,error,country,isoCode}
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
    } catch (error) {
        console.log(error)
    }
}

fetchingTest()