var Complaint = require('./models/complaint');

module.exports.createComplaint = function (pincode, geometry) {

    Complaint.find({
        pincode: pincode
    }).then(function (complaintsArray) {

        if (complaintsArray.length == 0) {
            return true;
        } else {
            var newLat = degreesToRadians(geometry.coordinates[0]);
            var newLng = degreesToRadians(geometry.coordinates[1]);
            var t = dataarray.length;
            for (i = 0; i < t; i++) {
                var datainstance = dataarray[i];
                var oldLat = degreesToRadians(datainstance.geometry.coordinates[0]);
                var oldLng = degreesToRadians(datainstance.geometry.coordinates[1]);


                //console.log();
                console.log(distanceInKmBetweenEarthCoordinates(newLat, newLng, oldLat, oldLng));
                if (distanceInKmBetweenEarthCoordinates(newLat, newLng, oldLat, oldLng) < 0.3) {
                    return false;
                } else {
                    if (i == dataarray.length - 1) {
                        return true;
                    }
                }
            }
        }
    }).catch(function (err) {
        console.log(err);
    });
};

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
};

function distanceInKmBetweenEarthCoordinates(newlat, newlon, oldlat, oldlon) {
    var earthRadiusKm = 6371;

    var dLat = degreesToRadians(oldlat - newlat);
    var dLon = degreesToRadians(oldlon - newlon);

    newlat = degreesToRadians(newlat);
    oldlat = degreesToRadians(oldlat);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(newlat) * Math.cos(oldlat);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
};