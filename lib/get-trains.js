const journeys = require('sncf').journeys;
const async = require('async');

module.exports = function (departure, arrival, date, duration, cb) {
    let data = [];
    if (Array.isArray(arrival)) {
        async.every(arrival, function(station, callback) {
            journeys(departure, station, date, {duration: duration})
            .then(function (r) {
                r.forEach(el => {
                    let found = false
                    for (var k in data) {
                        if (data[k].departure == el.legs[0].departure && data[k].id == el.legs[0].line.id) {
                            data[k].arrival[station] = el.legs[0].arrival;
                            found=true;
                            return;
                        }
                    }
                    if (!found) {
                        let type = 'TER';
                        if (el.legs[0].line.vehicleType == 'TGE') {
                            type = 'TGV';
                        }
                        if (el.legs[0].line.vehicleType == 'CAR') {
                            type = 'BUS'
                        }
                        data.push({
                            departure: el.legs[0].departure,
                            arrival: {[station]: el.legs[0].arrival},
                            id: el.legs[0].line.id,
                            type: type
                        });
                    }
                });
                callback(null, true);
            }).catch(console.error);
        }, err => {
            cb(err, data)
        });
    } else {
        async.every(departure, function(station, callback) {
            journeys(station, arrival, date, {duration: duration})
            .then(function (r) {
                r.forEach(el => {
                    let found = false
                    for (var k in data) {
                        if (data[k].arrival == el.legs[0].arrival && data[k].id == el.legs[0].line.id) {
                            data[k].departure[station] = el.legs[0].departure;
                            found=true;
                            return;
                        }
                    }
                    if (!found) {
                        let type = 'TER';
                        if (el.legs[0].line.vehicleType == 'TGE') {
                            type = 'TGV';
                        }
                        if (el.legs[0].line.vehicleType == 'CAR') {
                            type = 'BUS';
                        }
                        data.push({
                            arrival: el.legs[0].arrival,
                            departure: {[station]: el.legs[0].departure},
                            id: el.legs[0].line.id,
                            type: type
                        });
                    }
                });
                callback(null, true);
            }).catch(console.error);
        }, err => {
            cb(err, data)
        });
    }
}
