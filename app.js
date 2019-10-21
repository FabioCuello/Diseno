require('dotenv').config();
var dgram = require('dgram');
const mysql = require('mysql');
var express = require("express");
var bodyParser = require("body-parser");
var search
var taxi
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
});
// Define PORT & HOST of the UDP server which will act as a sniffer
var PORT = 50010;
var HOST = '';

// this dgram librery will enable to use udp sockets, creating a server with it
var server = dgram.createSocket('udp4');
// bind the port and host to the server socket
server.bind(PORT, HOST);

//handler the incoming udp connections
server.on('message', function (message, remote) {
    var newdate = String(message).split(",");
    var newdateLat = parseFloat(newdate[0]);
    var newdateLong = parseFloat(newdate[1]);
    var data2send = {
        lat: parseFloat(newdateLat.toFixed(5)),
        long: parseFloat(newdateLong.toFixed(4)),
        time: parseInt(newdate[2]),
        device: newdate[3]
    };
    // insert into db
    var query = pool.query('INSERT INTO diseno (time, lat, lon,device) VALUES (?,?,?,?)', [data2send.time, data2send.lat, data2send.long, data2send.device], function (error, results, fields) {
        if (error) throw error;
        else {
            // set data2send properties with the last pushed item in data array
            console.log(query.sql);
        }
    });
});
// listener 
server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ':' + address.port);
});
// -----------------------------------------------------------------------------

// init express
var app = express();
// this makes public folder
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
// ----------------------
// make capable the server RESPONSE an http get for the route "/"
app.get("/", function (req, res) {
    res.sendFile("index.html");
})
// make capable the server RESPONSE an http get for the route "/data"
app.post("/data", function (req, res) {
    taxi = req.body.taxi;
    if (taxi == "C") {
        taxi = ["A", "B"];
    };
    // open database
    pool.query('SELECT * FROM `diseno` WHERE device in (?) ORDER BY num DESC LIMIT 1 ', [taxi], function (err, results, fields) {
        if (err) {
            console.log("error in query " + err)
        } else {
            console.log(results);
            if (results.length != 0) {
                //select the last data 
                //send data2send object to the js client side
                res.send(JSON.stringify(results[0]));
            };
        };
    });
    // ---------------------------------------------------------------
});

app.post("/consult", function (req, res) {
    var initDate = req.body.initDate;
    var finalDate = req.body.finalDate;
    console.log(initDate + " and " + finalDate);
    pool.query('SELECT * FROM `diseno` WHERE time BETWEEN (?) AND (?)', [initDate, finalDate], function (err, results, fields) {
        if (err) {
            console.log("error in query " + err)
        } else {
            if (results.length != 0) {
                //select the last data 
                console.log(results);
                res.send(results);
                //send data2send object to the js client side
            };
        };
    });
})
//listen the port 3000 for http protocol
app.listen(3000, function () {
    console.log("Running server too")
});