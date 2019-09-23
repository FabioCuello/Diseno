var mymap2 = L.map('mapid2').setView([10.988016, -74.799184], 13);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZmFiaWlvY3VlbGxvIiwiYSI6ImNrMDZrbTg3MDBhOG0zbm4wZHdqdDN3YmoifQ.7a3WY0JIMGHMBQXqByqEFg'
}).addTo(mymap2);
var xhr = new XMLHttpRequest();

$("#search").on("click", function () {
    var initDate = $("#initdate").val().split("/");
    var finalDate = $("#finaldate").val().split("/");
    var dateRange = {
        initDate: Date.UTC(parseInt(initDate[2]), parseInt(initDate[1]) - 1, parseInt(initDate[0]), 0, 0, 0),
        finalDate: Date.UTC(parseInt(finalDate[2]), parseInt(finalDate[1]) - 1, parseInt(finalDate[0]), 0, 0, 0)
    };
    console.log(dateRange);
    xhr.open('POST', '/consult', true);
    //send the get request
    xhr.setRequestHeader("Content-type", 'application/json');
    xhr.send(JSON.stringify(dateRange));
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);

            response.forEach(function (positions) {
                L.marker([positions.lat * 0.00001, positions.lon * 0.0001], {
                        icon: taximarker
                    })
                    .bindPopup('<p>LAT : </p>' + positions.lat + "\n" + '<p>LON : </p>' + positions.lon)
                    .addTo(mymap2)
            })
        }
    }
})






// ------------------------------------