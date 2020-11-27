import "./lib/loadEnv.mjs"
import { createApp } from "./app.mjs"
import { createServerUdp } from "./udpApp.mjs"
import { APP_ORIGIN, APP_PORT } from "./config/app.mjs"
import { connection } from "./db.mjs"

    ; (async () => {

        let connectionFail = true

        while (connectionFail) {

            try {
                connectionFail = false
                await connection.connect()

            } catch (error) {
                console.log(error)
                connectionFail = true
            }
        }

        const app = createApp()

        app.listen(+APP_PORT, () => {
            console.log(`Express Server on: ${APP_ORIGIN}`)
        })

        createServerUdp()
    })()