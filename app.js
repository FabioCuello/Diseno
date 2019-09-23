const mysql = require('mysql');
const connection = mysql.createConnection({
    host: "database-1.cgejhtdvpmhk.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "password",
    database: "diseno",
});
// Define PORT & HOST of the UDP server which will act as a sniffer
var PORT = 50010;
var HOST = '';
// Incomporate the "dgram library" with require('dgram')
var dgram = require('dgram');
// this dgram librery will enable to use udp sockets, creating a server with it
var server = dgram.createSocket('udp4');
// ---------------------------------------------
// transform from gps time to unix time (milliseconds from 1970)
gpsdate = require(__dirname + "/gpsdate.js");
// object to send
var data2send = {
    lat: "",
    long: "",
    time: "",
};

// ------------------------------
// bind the port and host to the server socket
server.bind(PORT, HOST);

//handler the incoming connections
server.on('message', function (message, remote) {
    // ----------------------------------------------------------------------
    var newdate = gpsdate.syrus_js(message);
    data2send.time = newdate;
    data2send.lat = parseInt(message.slice(16, 24));
    data2send.long = parseInt(message.slice(24, 32));
    // insert into db
    var query = connection.query('INSERT INTO diseno (time, lat, lon) VALUES (?,?,?)', [data2send.time, data2send.lat, data2send.long], function (error, results, fields) {
        if (error) throw error;
        else {
            // set data2send properties with the last pushed item in data array
            console.log(query.sql);
        }
    });
    // ----------------------------------------------------------------------
});
// listener 
server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ':' + address.port);
});
// -----------------------------------------------------------------------------
// Incomporate the "express librery". Express is a nodejs framework which 
// enable to use some of their funcionalities as routing. also help us to organice 
// and structure our code. Also init app will ejecute this express module
var express = require("express");
var bodyParser = require("body-parser");
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
app.get("/data", function (req, res) {
    // --------------------------------------------------------------
    // open database
    connection.query('SELECT * FROM `diseno` ORDER BY num DESC LIMIT 1 ', function (err, results, fields) {
        if (err) {
            console.log("error in query " + err)
        } else {
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
    connection.query('SELECT * FROM `diseno` WHERE time BETWEEN (?) AND (?)', [initDate, finalDate], function (err, results, fields) {
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