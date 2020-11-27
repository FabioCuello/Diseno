import mysql from "mysql2"
import { config_db } from "./config/db.mjs"

export const connection = mysql.createConnection(config_db)


