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
var Vmin = document.getElementById("vmin");
var Vmax = document.getElementById("vmax");

// define a counter in 0
var firstIteration = false;
var firstIterationA = false;
var firstIterationB = false;
var myMovingMarker,
    movingMarkerA,
    movingMarkerB;
var polyline,
    polylineA,
    polylineB
var cicle


$("#ras").click(function () {
    ClearPolyMap();
    firstIteration = false;
    firstIterationA = false;
    firstIterationB = false;
    const taxi = $("#inputGroupSelect01").val();
    if (taxi != "A" && taxi != "B" && taxi != "C") {
        alert("Tome un taxi para seguir");
        return false;
    }
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
    cicle = setInterval(upDateTaxi, 1000, taxi);
})



function upDateTaxi(taxi) {
    $.get("/data", function (data) {
        console.log(data)
        var response = data;
        // make the innerhtml be equal to the response.lat, .long and .time attributes
        lat.innerHTML = response[0].lat;
        lon.innerHTML = response[0].lon;
        var timeObject = new Date(response[0].time);
        date.innerHTML = timeObject.getDate() + "/" + (timeObject.getMonth() + 1) + "/" + timeObject.getFullYear()
        time.innerHTML = timeObject.getHours() + ":" + timeObject.getMinutes() + ":" + timeObject.getSeconds();

        vel.innerHTML = response[1].speed;
        lat2.innerHTML = response[1].lat;
        lon2.innerHTML = response[1].lon;
        var timeObject = new Date(response[1].time);
        date2.innerHTML = timeObject.getDate() + "/" + (timeObject.getMonth() + 1) + "/" + timeObject.getFullYear()
        time2.innerHTML = timeObject.getHours() + ":" + timeObject.getMinutes() + ":" + timeObject.getSeconds();

        if (taxi == "A") {
            var posGPS = [lat.innerHTML, lon.innerHTML];
            if (lat.innerHTML != " ") {
                AddIconAndPoly(posGPS);
                console.log(lat.innerHTML);
            };
        } else if (taxi == "B") {
            var posGPS = [lat2.innerHTML, lon2.innerHTML];
            if (lat2.innerHTML != " ") {
                AddIconAndPoly(posGPS);
            };
        } else if (taxi == "C") {
            AddMultipleIconsAndPolymaps(response);
        };
        console.log(timeObject);
        console.log(taxi);
    }, "json");
}