// Set center map
var mymap = L.map('mapid').setView([10.988016, -74.799184], 13);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZmFiaWlvY3VlbGxvIiwiYSI6ImNrMDZrbTg3MDBhOG0zbm4wZHdqdDN3YmoifQ.7a3WY0JIMGHMBQXqByqEFg'
}).addTo(mymap);

var osm = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
    mqi = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png", {
        subdomains: ['otile1', 'otile2', 'otile3', 'otile4']
    }),
    googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }),
    googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }),
    googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }),
    googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

var baseMaps = {
    "OpenStreetMap": osm,
    "MapQuestImagery": mqi,
    "Satelital": googleSat,
    "Google Street Map": googleStreets,
    "Google Hybrid": googleHybrid,
    "Google Terrain": googleTerrain
};

var overlays = { //add any overlays here

};

L.control.layers(baseMaps, overlays, {
    position: 'bottomleft'
}).addTo(mymap);

// Set icon
var taximarker = L.icon({
    iconUrl: 'taxi.png',
    iconSize: [70, 70],
    popupAnchor: [-3, -76],
})
// Select elements by id from the html 
var lat = document.getElementById("lat");
var lon = document.getElementById("lon");
var time = document.getElementById("time");
var date = document.getElementById("date");
var vel = document.getElementById("vel");
var lat2 = document.getElementById("lat2");
var lon2 = document.getElementById("lon2");
var time2 = document.getElementById("time2");
var date2 = document.getElementById("date2");
// define a counter in 0
var firstIteration = false;
var marker
var myMovingMarker
var polyline
var cicle
// Instance a XMLHttpRequest object
var xhr = new XMLHttpRequest();


$("#ras").click(function () {
    firstIteration = false;


    const taxi = $("#inputGroupSelect01").val();
    if (taxi == "A") {
        $("#A").css("display", "block");
        $("#B").css("display", "none");
    } else if (taxi == "B") {
        $("#B").css("display", "block");
        $("#A").css("display", "none");
    } else {
        $("#B").css("display", "block");
        $("#A").css("display", "block");
    }

    try {
        clearTimeout(cicle);
    } catch (err) {
        throw err;
    }
    //Execute check function every 2secs
    cicle = setInterval(check(taxi), 2000);
})




function check(taxi) {
    // Functions
    function ClearPolyMap() {
        try {
            // remove polyline and marker
            mymap.removeLayer(polyline);
            mymap.removeLayer(myMovingMarker);
        } catch (err) {
            console.log(err)
        };
    };

    // make an object with taxi input
    var taxiOption = {
        taxi: taxi,
    };

    ClearPolyMap();


    xhr.open('POST', '/data', true);
    xhr.setRequestHeader("Content-type", 'application/json');
    xhr.send(JSON.stringify(taxiOption));


    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response)
            // make the innerhtml be equal to the response.lat, .long and .time attributes
            if (taxi == "A") {
                lat.innerHTML = response.lat;
                lon.innerHTML = response.lon;
                var timeObject = new Date(response.time);
                console.log(timeObject)
                date.innerHTML = timeObject.getDate() + "/" + (timeObject.getMonth() + 1) + "/" + timeObject.getFullYear()
                time.innerHTML = timeObject.getHours() + ":" + timeObject.getMinutes() + ":" + timeObject.getSeconds();
                vel.innerHTML = response.vel;
                var posGPS = [response.lat, response.lon];
            } else if (taxi = "B") {
                lat2.innerHTML = response.lat;
                lon2.innerHTML = response.lon;
                var timeObject = new Date(response.time);
                console.log(timeObject)
                date2.innerHTML = timeObject.getDate() + "/" + (timeObject.getMonth() + 1) + "/" + timeObject.getFullYear()
                time2.innerHTML = timeObject.getHours() + ":" + timeObject.getMinutes() + ":" + timeObject.getSeconds();
                var posGPS = [response.lat, response.lon];
            };

            console.log(taxi);
            // This should only go in this condition only one time, (this is to setting the firt marker)
            if (firstIteration == false) {
                //set map in the new center, a zoom 20
                mymap.flyTo(posGPS, 20);
                // moving marker
                myMovingMarker = L.Marker.movingMarker([
                        posGPS,
                        posGPS
                    ],
                    [1000]);
                myMovingMarker.options.icon = taximarker;
                mymap.addLayer(myMovingMarker);
                // polyline
                polyline = L.polyline([
                    posGPS,
                    posGPS
                ], {
                    color: '#FACB01'
                });
                polyline.addTo(mymap);
                firstIteration = true;
            } else {
                //move map to new coordinates
                mymap.flyTo(posGPS);
                // mov marker to new position
                myMovingMarker.moveTo(posGPS, 3000)
                // add new polyline position
                setTimeout(function () {
                    polyline.addLatLng(posGPS);
                }, 3000)
                //...
            }
        };
    };
}