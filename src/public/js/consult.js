// setting map 2
var mymap2 = L.map('mapid2').setView([10.988016, -74.799184], 12);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 22,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoiZmFiaWlvY3VlbGxvIiwiYSI6ImNrMDZrbTg3MDBhOG0zbm4wZHdqdDN3YmoifQ.7a3WY0JIMGHMBQXqByqEFg'
}).addTo(mymap2);
L.control.layers(baseMaps, overlays, {
    position: 'bottomleft'
}).addTo(mymap2);

var taximarker2 = L.icon({
    iconUrl: 'images/taxi.png',
    iconSize: [35, 35],
    popupAnchor: [-3, -76],
})


// Declaring variables
var vectorCoordA = [],
    vectorCoordB = [],
    polyline2Map = [],
    myMovingMarker2A,
    myMovingMarker2B,
    vectorSpeed = []


// When search is press them...
$("#search").on("click", function () {
    try {
        clearTimeout(cicle);
    } catch (err) {
        throw err;
    }
    ClearPolyMap();
    // 
    if ($("#finaldate").val() == "" || $("#initdate").val() == "") {
        if ($("#finaldate").val() == "" & $("#initdate").val() == "") {
            alert("Indique las fechas");
        } else if ($("#finaldate").val() == "") {
            alert("Indique la fecha final")
        } else {
            alert("Indique una fecha inicial");
        }
        return
    }
    const taxi2 = $("#inputGroupSelect02").val();

    if (taxi2 != "A" && taxi2 != "B" && taxi2 != "C") {
        console.log(taxi2)
        alert("Seleccione el taxi el cual consultar");
        return
    }
    var input1 = $("#initdate").val().split(" ");
    var input2 = $("#finaldate").val().split(" ");
    //init date
    var initDate = input1[0].split("/");
    var initHour = input1[1].split(":");
    // final date
    var finalDate = input2[0].split("/");
    var finalHour = input2[1].split(":");

    // make an object depending on initDate an finalDate 
    var dateRange = {
        initDate: Date.parse(new Date(parseInt(initDate[2]), parseInt(initDate[1]) - 1, parseInt(initDate[0]), parseInt(initHour[0]), parseInt(initHour[1]), 0)),
        finalDate: Date.parse(new Date(parseInt(finalDate[2]), parseInt(finalDate[1]) - 1, parseInt(finalDate[0]), parseInt(finalHour[0]), parseInt(finalHour[1]), 0))
    };
    console.log(dateRange);

    // init vectorCoord empty
    vectorCoordA = [];
    vectorCoordB = [];
    vectorSpeed = [];

    $.post("/consult", dateRange, function (response) {
        console.log(response);
        // push every lat and lon into the vectorCoord
        response.forEach(function (positions) {
            if (positions.device == "A") {
                vectorCoordA.push([positions.lat, positions.lon]);
                vectorSpeed.push([positions.speed]);
            } else if (positions.device == "B") {
                vectorCoordB.push([positions.lat, positions.lon]);
            };
        });

        // polyline
        polyline2MapA = L.polyline(vectorCoordA, {
            color: '#FACB01'
        });
        polyline2MapB = L.polyline(vectorCoordB, {
            color: '#000000'
        });
        // marker
        myMovingMarker2A = L.Marker.movingMarker(vectorCoordA,
            10000, {
            autostart: true,
            loop: true
        });
        myMovingMarker2B = L.Marker.movingMarker(vectorCoordB,
            10000, {
            autostart: true,
            loop: true
        });

        myMovingMarker2A.options.icon = taximarker2;
        myMovingMarker2B.options.icon = taximarker2;
        // criterio de selección, mostrar uno u el otro

        if (taxi2 == "C") {
            // add polyline and marker to the map
            mymap2.addLayer(myMovingMarker2B);
            mymap2.addLayer(myMovingMarker2A);
            polyline2MapA.addTo(mymap2);
            polyline2MapB.addTo(mymap2);
            Vmin.innerHTML = Math.min(...vectorSpeed);
            Vmax.innerHTML = Math.max(...vectorSpeed);
        } else if (taxi2 == "A") {
            mymap2.addLayer(myMovingMarker2A);
            polyline2MapA.addTo(mymap2);
            Vmin.innerHTML = Math.min(...vectorSpeed);
            Vmax.innerHTML = Math.max(...vectorSpeed);
        } else if (taxi2 == "B") {
            mymap2.addLayer(myMovingMarker2B);
            polyline2MapB.addTo(mymap2);
            Vmin.innerHTML = 0;
            Vmax.innerHTML = 0;
        }
    });
})






// ------------------------------------