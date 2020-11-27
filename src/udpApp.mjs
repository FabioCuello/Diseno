import dgram from "dgram"
import { D_PORT, D_HOST } from "./config/dgram.mjs"
import { udpToDB } from "./lib/udpToDB.mjs"

export const createServerUdp = () => {

    console.log(D_HOST, D_PORT)
    const server = dgram.createSocket("udp4")

    server.bind(+D_PORT, +D_HOST)

    server.on('message', udpToDB)

    server.on('listening', () => {
        const address = server.address()

        console.log('UDP Server listening on ' + address.address + ':' + address.port);
    })

    return server
}



