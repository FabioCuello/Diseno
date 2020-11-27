import express from "express"
import bodyParser from "body-parser"
import { index } from "./routes/index.mjs"
import { data } from "./routes/data.mjs"
import { consult } from "./routes/consult.mjs"
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

//rutas

export const createApp = () => {

    const app = express()

    app.use(express.static(__dirname + "/../src/public"))

    app.use(bodyParser.urlencoded({ extended: false }))

    app.use(index)

    app.use(data)

    app.use(consult)

    return app
}

