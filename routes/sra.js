
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var RepairProgress = require('./../models/repairProgress');
var User = require('./../models/user');
//var SSAReport = require('./../models/ssa/report');
var Allocation = require('./../models/allocation');
var Complaint = require('./../models/complaint');
var multer = require('multer');


var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, 'E:/c down/vayufinal/Images2');
  },
  filename: function(req, file, callback) {
    callback(null, Date.now() + /*Path.extname(file.originalname)*/ '.jpg'); //required
  }
});

var upload = multer({
  storage: storage
});

var parseUrlencoded = bodyParser.urlencoded({extended: false});

//router.route('/')
//router.route('/works')

router.route('/works/newUpdate') //for sra to send updates
    .all(bodyParser.json())
    .post(parseUrlencoded,upload.any(), function(req, res) {

        //need to load image
        var description = req.body.description;
        var complaintId=mongoose.Types.ObjectId('5ab7abc4a76fd76f540518e3');
        var filesPath=[];
        console.log(req.files);
        req.files.forEach(function(image){
          filesPath.push(image.path);
        });

      var repairProgress=new RepairProgress({
        complaintId:complaintId,
        filesPath:filesPath,
        description:description,
        status:2
      });
      RepairProgress.addRepairProgress(repairProgress)
      .then(function(repairInstance){
        console.log(repairInstance);
      })
      .catch(function(err){
        console.log(err);
        res.json({
          error: err

      });
    });


    });

router.route('/user') //for sra to register
    .all(bodyParser.json())
    .post(parseUrlencoded, function(req, res) {

        var sraName = req.body.sraName;
        var sraId = req.body.sraId;
        var pincode = req.body.pincode;

        var user = new User({
            sraName: sraName,
            sraId: sraId,
            pincode: pincode
        });

        User.addSRAusr(user, function(err, user) {
            if(err) throw err;
            console.log(user);
        });
    });

    router.route('/works/workAcception') //for sra to send updates
    .all(bodyParser.json())
    .put(parseUrlencoded, function(req, res) {
        //description properties
        var estimatedTime = req.query.estimatedTime;
        console.log(estimatedTime);
        var complaintId = mongoose.Types.ObjectId('5ab7abc4a76fd76f540518e3');
        // Allocation.getAllocByCompId(complaintId)
        // .then(function(complaintInstance){
          Allocation.putAllocation(complaintId ,estimatedTime)
          .then(function(returedvalue){
            console.log(returedvalue);
          }).catch(function(err){
            console.log(err);
            res.json({
              error:err
            });
          });

        // }).catch(function(err){
        //   console.log(err);
        //   res.json({
        //     error:err
        //   });
        // })
       
});

router.route('/works/workCompletion') //for sra to send updates
    .all(bodyParser.json())
    .put(parseUrlencoded, function(req, res) {
        //description properties
        var status = 3;
        //console.log(estimatedTime);
        var complaintId = mongoose.Types.ObjectId('5ab7abc4a76fd76f540518e3');
        // Allocation.getAllocByCompId(complaintId)
        // .then(function(complaintInstance){
          Allocation.putAllocationStatus(complaintId ,status)
          .then(function(returedvalue){
            console.log(returedvalue);
          }).catch(function(err){
            console.log(err);
            res.json({
              error:err
            });
          });
        });

//receiving works from sma
router.route('/work')
    .get(function(req, res) {
        //written in ssa/report.js
        var sraId = req.query.email;
        Allocation.getComplaintId(sraId)
        .then(function(allocation) {
          console.log(allocation);
            complaintId = allocation.complaintId;
            console.log(complaintId);
            Complaint.getComplaintForSra(complaintId)
            .then(function(complaint) {
              res.send(complaint);
            })
            .catch(function(err){
              console.log(err);
              res.json({
                error: err
              });

        });
      })
        .catch(function(err) {
          console.log(err);
          res.json({
            error: err
          });

});
});


//router.route('')
module.exports = router;
