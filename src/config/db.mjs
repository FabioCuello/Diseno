const {
    CONNECTION_LIMIT,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DATABASE,
    DB_PORT
} = process.env

export const config_db = {
    connectionLimit: CONNECTION_LIMIT,
    host: "db",
    port: "3002",
    user: "user",
    password: "pass",
    database: "project1"

}