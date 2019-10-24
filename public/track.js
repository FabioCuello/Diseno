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
    cicle = setInterval(upDateTaxi(taxi), 2000);
})



function upDateTaxi(taxi) {
    // make an object with taxi input
    var taxiOption = {
        taxi: taxi,
    };

    ClearPolyMap();


    $.post("/data", taxiOption, function (data) {
        console.log(data)
        var response = data;
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
    }, "json");
}