var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Complaint = require('./../models/complaint');
var Allocation = require('./../models/allocation');
var RepairProgress = require('./../models/repairProgress');


var parseUrlencoded = bodyParser.urlencoded({
    extended: false
});

//to get reported complaints from public
router.route('/')
    .get(function (req, res) {

        //written in complaint.js
        Complaint.getComplaintByPin(req.query.pin, function (err, complaints) {
            if (err) return handleError(err);
            return res.status(200).json(complaints);
        });
    });

//assigning work to sra
router.route('/complaint/sra')
    .all(bodyParser.json())
    .post(parseUrlencoded, function (req, res) {
        var sraId = "vikas1@gmail.com";
        var smaId = "vikas2@gmail.com";

        //written in ssa/report.js
        complaintId = mongoose.Types.ObjectId("5ab7abc4a76fd76f540518e3");
        Allocation.assignToSRA(complaintId, sraId, smaId).then(function (allocationInstance) {
                console.log(allocationInstance);
            })
            .catch(function (err) {
                console.log(err);
            });
    })

//receiving updates from sra
router.route('/works/updates')
    .get(function (req, res) {
        var complaintId = mongoose.Types.ObjectId("");
        RepairProgress.getUpdates(complaintId).then(function (update) {
                res.send(update);
            })
            .catch(function (err) {
                console.log(err);
            })
    })

module.exports = router;