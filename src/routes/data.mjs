import { Router } from "express"
import { connection } from "../db.mjs"

const router = Router()

router.get("/data", async (req, res) => {
    const info = []
    try {
        const [devices] = await connection.promise().query('SELECT * FROM devices')

        for (const device in devices) {

            const [[lastInf]] = await connection.promise().query(`SELECT * FROM data WHERE device ='${devices[device].device}' ORDER BY num DESC LIMIT 1`)
            info.push(lastInf)
        }

        res.send(info)

    } catch (error) {
        console.log(`Error: ${error}`)
    }

})

export { router as data }


