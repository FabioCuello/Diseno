import { Router } from "express"
import { connection } from "../db.mjs"

const router = Router()

router.post("/consult", async (req, res) => {
    const { initDate, finalDate } = req.body

    try {
        const [results] = await connection.promise().query("SELECT * FROM `data` WHERE time BETWEEN (?) AND (?)", [initDate, finalDate])

        if (results.length == 0) return

        res.send(results)

    } catch (error) {
        console.log(`Error: ${error}`)
    }
})

export { router as consult }
