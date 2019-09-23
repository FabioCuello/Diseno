var gpsTime = require('gps-time');
var yearinMilliseconds = 3.154 * Math.pow(10, 10);
var weekinMilliseconds = 6.048 * Math.pow(10, 8);
var dayinMilliseconds = 8.64 * Math.pow(10, 7);
var hourinmilliseconds = 3.6 * Math.pow(10, 6);
var minuteinmilliseconds = 60000;
var secondinmilliseconds = 1000;
exports.syrus_js = function (consult) {
    var dayGps = (parseInt(consult.slice(10, 11)) + 1) * dayinMilliseconds;
    //weeks gps
    var weekGps = parseInt(consult.slice(6, 10)) * weekinMilliseconds;
    // seconds gps
    var secondGps = parseInt(consult.slice(11, 16)) * secondinmilliseconds;
    //milliseconds of gps date since 1970 (23,59,45 number are to calibrate)
    var newdate = gpsTime.toUnixMS(weekGps + dayGps - 23 * hourinmilliseconds - 59 * minuteinmilliseconds - secondinmilliseconds * 45 + secondGps);
    return newdate;
}
exports.js_syrus = function (day, month, year) {
    var dayjs = parseInt(day) * dayinMilliseconds;
    var monthjs = parseInt(month) * weekinMilliseconds * 4;
    var yearjs = parseInt(year) * yearinMilliseconds;
    var newsyrusdate = dayjs + monthjs + yearjs;
    return newsyrusdate
};