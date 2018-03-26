var mongoose = require('mongoose');
var GeoJSON = require('mongoose-geojson-schema'); // for geo cordinates

var complaintSchema = new mongoose.Schema({

    // userId
    email: {
        type: String,
        ref: 'user',
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        //required: true,
    },
    complaintId: {
        type: Number,
        minlength: 7,
        unique: true
        //required: true,
    },
    description: {
        type: String,
    },
    severity: {
        type: String,
        enum: ['high', 'medium', 'low'],
        //required: true
    },
    location: {
        type: String,
    },
    pincode: {
        type: Number,
        minlength: 6,
        maxlength: 6,
        match: /^[1-9][0-9]{5}$/
        //required: true
    },
    geometry: {
        type: mongoose.Schema.Types.Point,
        //required: true
    },
    orginal: {
        type: Boolean
    },
    filePath: [{
        type: String
    }]
}, {
    timestamps: true
});

var Complaint = module.exports = mongoose.model('Complaint', complaintSchema);

//for adding complaints by public
module.exports.createComplaint = function (newComplaint, callback) {
    newComplaint.save(callback);
};

//for retrieving complaint for sma based on pin
module.exports.getComplaintByPin = function (pin_sma, callback) {
    Complaint.find({
        $and: [{
            pincode: pin_sma
        }, {
            orginal: true
        }]
    }, callback);
};

/** */
//retieves complaints by using users collections documents _id
module.exports.getComplaint = function (userId, callback) {
    Complaint.findOne({
        userId: userId
    }, callback);
};

//for displaying complaints assigned to a particular user
module.exports.findComplaintsBySSAId = function (ssaId, callback) {
    Complaint.find({
        ssaId: ssaId
    }, callback);
};


module.exports.assignToSRA = function (complaintId, sraId) {
    Complaint.findByIdAndUpdate(complaintId, {
        $set: {
            sraId: sraId
        }
    }, {
        new: true
    });
};


module.exports.getComplaintForSra = function (complaintId) {
    return Complaint.find().where({
        _id: complaintId
    });
};