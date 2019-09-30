// setting map 2
var mymap2 = L.map('mapid2').setView([10.988016, -74.799184], 12);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 22,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZmFiaWlvY3VlbGxvIiwiYSI6ImNrMDZrbTg3MDBhOG0zbm4wZHdqdDN3YmoifQ.7a3WY0JIMGHMBQXqByqEFg'
}).addTo(mymap2);
L.control.layers(baseMaps, overlays, {
    position: 'bottomleft'
}).addTo(mymap2);

var taximarker2 = L.icon({
    iconUrl: 'taxi.png',
    iconSize: [35, 35],
    popupAnchor: [-3, -76],
})


// Declaring variables
var vectorCoord = [],
    polyline2Map = [],
    myMovingMarker2;
// declaring new XMLHttpRequest object
var xhr2 = new XMLHttpRequest();

// When search is press them...
$("#search").on("click", function () {
    // 
    try {
        // remove polyline and marker
        mymap2.removeLayer(polyline2Map);
        mymap2.removeLayer(myMovingMarker2);
    } catch (err) {
        console.log(err)
    };
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
    // get init date and final date
    // init date 
    // 14/09/2019 22:03 = A.split(" ")
    // A = [[14/09/2019],[22:03]]
    // B=A[0] = 14/09/2019
    // A[1] = 22:03
    // B.split("/") = B=[[14],[09],[2019]]
    // new Date(año,mes,dia,hora,minuto,sec,mil) = 30 de enero de 2019 hora, minutos
    // date.parse(new Date(año,mes,dia,hora,minuto,sec,mil))= milisegundos desde 1970 hasta la fecha de 30 de enero...

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

    // setting the request method
    xhr2.open('POST', '/consult', true);
    //send the get request as a jSON
    xhr2.setRequestHeader("Content-type", 'application/json');
    xhr2.send(JSON.stringify(dateRange));

    // init vectorCoord empty
    vectorCoord = [];
    // VECTOR = [[LAT1,LONG1],[LAT2,LONG2]....]

    xhr2.onreadystatechange = function () {
        if (xhr2.readyState == 4 && xhr2.status == 200) {
            // vector = [OBJETO1, OBJETO2, ...]
            // OBJETO1 {
            // LAT:121231
            // LON:12312312
            // }
            // If a result is ready
            var response = JSON.parse(xhr2.responseText);
            // push every lat and lon into the vectorCoord
            response.forEach(function (positions) {
                vectorCoord.push([positions.lat, positions.lon]);
            })
            setTimeout(function () {
                // polyline
                polyline2Map = L.polyline(vectorCoord, {
                    color: '#FACB01'
                });
                // marker
                myMovingMarker2 = L.Marker.movingMarker(vectorCoord,
                    10000, {
                        autostart: true,
                        loop: true
                    });
                myMovingMarker2.options.icon = taximarker2;
                // add polyline and marker to the map
                mymap2.addLayer(myMovingMarker2);
                polyline2Map.addTo(mymap2);
            }, 1);
        }
    }
})






// ------------------------------------