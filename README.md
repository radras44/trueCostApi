# Uso

esta Api usa graphql, por lo que todas las peticiones se hacen al siguiente endpoint:
```
https://truecostapi.onrender.com/graphql
```
las peticiones tienen que enviar una consulta gql, aqui un ejemplo de como se tendria que hacer esto, es similar a una peticion normal.

### headers requeridos
```js
headers : {
    authorization : "trueCostApiRadras",
    "Content-Type" : "application/json"
}
```
### Ejemplo de peticion
```js
async function fetching() {
    const query = `lorem ipsum` //insertar alguna consulta valida
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
```
Tambien puedes ingresar a [https://truecostapi.onrender.com/graphql] directamente y hacer consultas haciendo uso de la interfaz de usuario


## Resolvers

### convertCurrency
Permite hacer cambios de divisas
```
args : {
    from : String!
    to : String!
    amount : Float!
}
return : {
    status : Boolean!
    error : String
    result : Float
}
```
```js
query {
    convertCurrency (data : {
        amount : 1
        from : "USD"
        to : "CLP"
    })
    {status,error,result}
}

```
### countryInfo
Permite obtener informacion disponible en la api sobre algun pais
```
args : {
    country : String!
}
return : {
    status : Boolean!
    error : String
    country : String
    isoCode : String
    usdInCurrency : Float
    minimumWage : Float
    ivaGeneral : Float
}
```

```js
query {
    countryInfo (data : {
        country : "Chile"
    })
    {status,error,country,isoCode,usdInCurrency,minimumWage,ivaGeneral}
}
```
### relativeCost
Permite hacer cambios de divisa segun el ciertos factores como el sueldo minimo y el iva general en los paises correspondientes
```
args : {
    from : String!
    to : String!
    amount : Float!
}
return : {
    status : Boolean!
    error : String
    result : Float
}
```

``` js
query {
    relativeCost (data : {
        amount : 330
        from : "ARS"
        to : "CLP"
    })
    {status,error,result}
}
```

    