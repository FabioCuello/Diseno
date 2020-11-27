// Set center map
var mymap = L.map('mapid').setView([10.988016, -74.799184], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox/streets-v11',
    accessToken: "pk.eyJ1IjoiZmFiaW9jdWVsbG9oIiwiYSI6ImNraTByZHozZTB3dnQycG8zMmx1bHlxeXEifQ.aXi0zMoxs7iVQ65BGnaEcQ"
}).addTo(mymap);

var osm = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),

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
    iconUrl: 'images/taxi.png',
    iconSize: [70, 70],
    popupAnchor: [-3, -76],
})


function ClearPolyMap() {
    try {
        mymap.removeLayer(polyline);
        mymap.removeLayer(myMovingMarker);
    } catch (err) {
        console.log(err)
    }
    try {
        mymap.removeLayer(polylineA);
        mymap.removeLayer(movingMarkerA);
    } catch (err) {
        console.log(err)
    }
    try {
        mymap.removeLayer(polylineB);
        mymap.removeLayer(movingMarkerB);
    } catch (err) {
        console.log(err)
    }
    try {
        mymap2.removeLayer(polyline2MapA);
        mymap2.removeLayer(myMovingMarker2A);
    } catch (err) {
        console.log(err)
    }
    try {
        mymap2.removeLayer(polyline2MapB);
        mymap2.removeLayer(myMovingMarker2B);
    } catch (err) {
        console.log(err)
    };
};

function AddIconAndPoly(posGPS) {
    if (firstIteration == false) {
        //set map in the new center, a zoom 20
        mymap.flyTo(posGPS, 20);
        // create moving marker
        myMovingMarker = L.Marker.movingMarker([posGPS, posGPS], [1000]);
        myMovingMarker.options.icon = taximarker;

        // create polyline
        polyline = L.polyline([posGPS, posGPS], {
            color: '#FACB01'
        });
        // add moving marker and polyline to the layer
        mymap.addLayer(myMovingMarker);
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
    };
}

function AddMultipleIconsAndPolymaps(response) {
    if (response[0].device == "A") {
        var coords = [response[0].lat, response[0].lon]
        if (firstIterationA == false) {
            movingMarkerA = L.Marker.movingMarker([coords, coords], [1000]);
            movingMarkerA.options.icon = taximarker;

            // create polyline
            polylineA = L.polyline([coords, coords], {
                color: '#FACB01'
            });
            // add moving marker and polyline to the layer
            mymap.addLayer(movingMarkerA);
            polylineA.addTo(mymap);
            firstIterationA = true;
        } else {
            // mov marker to new position
            movingMarkerA.moveTo(coords, 3000)
            // add new polyline position
            setTimeout(function () {
                polylineA.addLatLng(coords);
            }, 3000)
        }
    }
    if (response[1].device == "B") {
        var coords2 = [response[1].lat, response[1].lon]
        if (firstIterationB == false) {
            movingMarkerB = L.Marker.movingMarker([coords2, coords2], [1000]);
            movingMarkerB.options.icon = taximarker;

            // create polyline
            polylineB = L.polyline([coords2, coords2], {
                color: '#FACB01'
            });
            // add moving marker and polyline to the layer
            mymap.addLayer(movingMarkerB);
            polylineB.addTo(mymap);
            firstIterationB = true;
        } else {
            // mov marker to new position
            movingMarkerB.moveTo(coords2, 1000)
            // add new polyline position
            setTimeout(function () {
                polylineB.addLatLng(coords2);
            }, 1000)
        };
    }

}