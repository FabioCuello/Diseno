import { connection } from "../db.mjs"

export const udpToDB = message => {
    const newdate = String(message).split(",");
    const newdateLat = parseFloat(newdate[0]);
    const newdateLong = parseFloat(newdate[1]);
    const data2send = {
        lat: newdateLat,
        lon: newdateLong,
        time: parseInt(newdate[2]),
        device: newdate[3],
        speed: parseFloat(newdate[4]),
    };
    console.log(`New msg: ${data2send}`)
    try {
        const result = connection.query('INSERT INTO data (lat, lon, time, device, speed) VALUES (?,?,?,?,?)', [data2send.lat, data2send.lon, data2send.time, data2send.device, data2send.speed], (error, results, fields) => {
            if (error) { console.log(error) }
            else {
                console.log(result.sql)
            }
        })
    }
    catch (err) {
        console.log(err)
    }
}