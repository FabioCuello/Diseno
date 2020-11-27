//                               show modals***
// show modal 1 on click
$("#bmodal1").on("click", function () {
    $("#modal1").modal();

});
// show modal 2 on click
$("#bmodal2").on("click", function () {
    $("#modal-date").modal();
});

//                        resolve conflict with the map size***
$('#modal1').on('show.bs.modal', function () {
    setTimeout(function () {
        mymap.invalidateSize();

    }, 0.2);
});

$('#modal-date').on('show.bs.modal', function () {
    setTimeout(function () {
        mymap2.invalidateSize();

    }, 0.2);
});

$(function () {
    $('#datetimepicker6').datetimepicker({
        locale: "es"
    });
    $('#datetimepicker7').datetimepicker({
        useCurrent: false, //Important! See issue #1075
        locale: "es"
    });
    $("#datetimepicker6").on("dp.change", function (e) {
        $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
    });
    $("#datetimepicker7").on("dp.change", function (e) {
        $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
    });
});