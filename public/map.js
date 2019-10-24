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

function ClearPolyMap() {
    try {
        // remove polyline and marker
        mymap.removeLayer(polyline);
        mymap.removeLayer(myMovingMarker);
    } catch (err) {
        console.log(err)
    };
};