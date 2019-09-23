// Set center map
var mymap = L.map('mapid').setView([10.988016, -74.799184], 13);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZmFiaWlvY3VlbGxvIiwiYSI6ImNrMDZrbTg3MDBhOG0zbm4wZHdqdDN3YmoifQ.7a3WY0JIMGHMBQXqByqEFg'
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
// Instance a XMLHttpRequest object
var xhr = new XMLHttpRequest();
//Execute check function every 2secs
setInterval(check, 2000);
// define a counter in 0
var count = 0;
var marker
var myMovingMarker
var polyline

function check() {
    // open method is required because it allowed us to 
    // create an get request 
    xhr.open('GET', '/data', true);
    //send the get request
    xhr.send();

    //look if the state of the request changed
    //If this happpen, whe have a valid reponseText
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            // make the innerhtml be equal to the response.lat, .long and .time attributes
            lat.innerHTML = response.lat;
            lon.innerHTML = response.lon;

            var timeObject = new Date(response.time);
            console.log(timeObject)
            date.innerHTML = timeObject.getDate() + "/" + (timeObject.getMonth() + 1) + "/" + timeObject.getFullYear()
            time.innerHTML = timeObject.getHours() + ":" + timeObject.getMinutes() + ":" + timeObject.getSeconds();
            var posGPS = [response.lat * 0.00001, response.lon * 0.0001];
            // This should only go in this condition only one time, (this is to setting the firt marker)
            if (count == 0) {
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
                    color: 'black'
                });
                polyline.addTo(mymap);
                count = count + 1;
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
            // console.log(posGPS);
        };
    };
}