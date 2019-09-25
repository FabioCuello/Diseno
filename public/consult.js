// setting map 2
var mymap2 = L.map('mapid2').setView([10.988016, -74.799184], 13);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZmFiaWlvY3VlbGxvIiwiYSI6ImNrMDZrbTg3MDBhOG0zbm4wZHdqdDN3YmoifQ.7a3WY0JIMGHMBQXqByqEFg'
}).addTo(mymap2);
L.control.layers(baseMaps, overlays, {
    position: 'bottomleft'
}).addTo(mymap2);
var xhr2 = new XMLHttpRequest();


var marker = [];
var vectorCoord = [];
var polyline2Map = [];

$("#search").on("click", function () {
    try {
        marker.forEach(element => {
            mymap2.removeLayer(element);
            console.log("entra a borrar");
        });
        mymap2.removeLayer(polyline2Map);
    } catch (err) {
        console.log(err)
    };
    var input1 = $("#initdate").val().split(" ");
    var input2 = $("#finaldate").val().split(" ");
    //init date
    var initDate = input1[0].split("/");
    // 
    var initHour = input1[1].split(":");
    // final date
    var finalDate = input2[0].split("/");
    var finalHour = input2[1].split(":");
    var dateRange = {
        initDate: Date.parse(new Date(parseInt(initDate[2]), parseInt(initDate[1]) - 1, parseInt(initDate[0]), parseInt(initHour[0]), parseInt(initHour[1]), 0)),
        finalDate: Date.parse(new Date(parseInt(finalDate[2]), parseInt(finalDate[1]) - 1, parseInt(finalDate[0]), parseInt(finalHour[0]), parseInt(finalHour[1]), 0))
    };
    console.log(dateRange);
    xhr2.open('POST', '/consult', true);
    //send the get request
    xhr2.setRequestHeader("Content-type", 'application/json');
    xhr2.send(JSON.stringify(dateRange));
    marker = []
    vectorCoord = [];
    var count2 = 0;
    xhr2.onreadystatechange = function () {
        if (xhr2.readyState == 4 && xhr2.status == 200) {
            console.log("ENTRAAAA")
            var response = JSON.parse(xhr2.responseText);
            response.forEach(function (positions) {
                vectorCoord.push([positions.lat * 0.00001, positions.lon * 0.0001]);
                var myMarkers = L.marker([positions.lat * 0.00001, positions.lon * 0.0001], {
                        icon: taximarker
                    })
                    .bindPopup('<p>LAT : </p>' + positions.lat + "\n" + '<p>LON : </p>' + positions.lon);
                marker.push(myMarkers);
                mymap2.addLayer(marker[count2]);
                count2 = count2 + 1;
            })
            setTimeout(function () {
                polyline2Map = L.polyline(vectorCoord, {
                    color: 'black'
                });
                console.log("ENTRO")
                polyline2Map.addTo(mymap2);
            }, 1);
        }
    }
})






// ------------------------------------