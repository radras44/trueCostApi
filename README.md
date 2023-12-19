# Uso

Esta API utiliza GraphQL, por lo que todas las peticiones se realizan al siguiente endpoint:
```
https://truecostapi.onrender.com/graphql
```
Las peticiones deben enviar una consulta GraphQL. Aquí tienes un ejemplo de cómo se debería hacer esto, similar a una petición normal.

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
También puedes ingresar directamente a [https://truecostapi.onrender.com/graphql] y hacer consultas haciendo uso de la interfaz de usuario.


## Resolvers

### convertCurrency
Permite realizar cambios de divisas.
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
Permite obtener información disponible en la API sobre algún país.
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
    {status,error,country,isoCode,usdInCur rency,minimumWage,ivaGeneral}
}
```
### relativeCost
Permite realizar cambios de divisa según ciertos factores como el sueldo mínimo y el IVA general en los países correspondientes.
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

    