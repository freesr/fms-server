
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Complaint = require('./../models/complaint');
var Allocation = require('./../models/allocation');


var parseUrlencoded = bodyParser.urlencoded({extended: false});

//to get reported complaints
router.route('/')
    .get(function(req, res) {
        //pin from url
        //written in public/complaint.js
        Complaint.getComplaintByPin(req.query.pin, function(err, complaints) {
            if(err) return handleError(err);
            return res.status(200).json(complaints);
            });
    });
//assigning work to sra
router.route('/complaint/sra')
    .all(bodyParser.json())
    .post(parseUrlencoded, function(req, res) {
        var sraId = "vikas1@gmail.com";
        var smaId = "vikas2@gmail.com";
        //should be taken from list
       //change as data base changes
        //written in ssa/report.js
        complaintId = mongoose.Types.ObjectId("5ab7abc4a76fd76f540518e3");
         Allocation.assignToSRA(complaintId,sraId, smaId).then(function(allocationInstance){
           console.log(allocationInstance);
         })
         .catch(function(err){
           console.log(err);
         });
    });
//receiving updates from sra
router.route('/works/updates')
    .get(function(req, res) {
        //written in sra/update.js
        SRAUpdate.getUpdates(function(err, updates) {
            if(err) return handleError(err);
            setTimeout(function(){
                return res.status(200).send(updates);
            },5000);
        });
    });
module.exports = router;
