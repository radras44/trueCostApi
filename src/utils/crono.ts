interface Options {
    comprobationTime: number
    minTimeBetweenUpdate: number
    lastUpdateDate: Date
    action : () => Promise<void> | void
    initAction? : () => Promise<void> | void
    name : string
}

export function createScheduledTask({ comprobationTime, minTimeBetweenUpdate, lastUpdateDate ,action,name}: Options) {
    console.log(name,"has been initialized")
    setInterval(async () => {
        console.log("comprobacion Extractor-crono...")
        const currentDate = new Date()
        const difference = currentDate.getTime() - lastUpdateDate.getTime()
        if (difference > minTimeBetweenUpdate) {
            console.log("tiempo entre actualizacion mayor a 24 horas, realizando accion...")
            await action()
        } else {
            let timeLeft = (minTimeBetweenUpdate - difference)
            let hours = Math.floor(timeLeft / (1000 * 60 * 60))
            let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
            let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
            console.log(`quedan ${hours} con ${minutes} y ${seconds} hasta la siguiente actualizacion`)
        }

    }, comprobationTime)
}