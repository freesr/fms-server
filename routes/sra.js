var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var RepairProgress = require('./../models/repairProgress');
var User = require('./../models/user');
var Allocation = require('./../models/allocation');
var Complaint = require('./../models/complaint');
var multer = require('multer');


var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './../sraImages');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + Path.extname(file.originalname));
  }
});

var upload = multer({
  storage: storage
});

var parseUrlencoded = bodyParser.urlencoded({
  extended: false
});

//for sra to send updates
router.route('/works/newUpdate') 
  .all(bodyParser.json())
  .post(parseUrlencoded, upload.any(), function (req, res) {

    //need to load image
    var description = req.body.description;
    var complaintId = mongoose.Types.ObjectId('5ab7abc4a76fd76f540518e3');
    var filesPath = [];
    console.log(req.files);
    req.files.forEach(function (image) {
      filesPath.push(image.path);
    });

    var repairProgress = new RepairProgress({
      complaintId: complaintId,
      filesPath: filesPath,
      description: description,
      status: 2
    });
    RepairProgress.addRepairProgress(repairProgress)
      .then(function (repairInstance) {
        console.log(repairInstance);
      })
      .catch(function (err) {
        console.log(err);
        res.json({
          error: err
      });
    });
  })

//for sra to accept work
router.route('/works/workAcception')
  .all(bodyParser.json())
  .put(parseUrlencoded, function (req, res) {

    var estimatedTime = req.query.estimatedTime;
    var complaintId = mongoose.Types.ObjectId('5ab7abc4a76fd76f540518e3');
    
    //written in allocation.js
    Allocation.updateEstimatedTime(complaintId, estimatedTime)
      .then(function (returedvalue) {
        console.log(returedvalue);
      }).catch(function (err) {
        console.log(err);
        res.json({
          error: err
        });
      });
  });

//for sra to send completion response to sma 
router.route('/works/workCompletion')
  .all(bodyParser.json())
  .put(parseUrlencoded, function (req, res) {

    var status = 3;
    var complaintId = mongoose.Types.ObjectId('5ab7abc4a76fd76f540518e3');
    
    //written in allocation.js
    Allocation.updateCompletionStatus(complaintId, status)
      .then(function (returedvalue) {
        console.log(returedvalue);
      }).catch(function (err) {
        console.log(err);
        res.json({
          error: err
        });
      });
  })

//receiving works from sma
router.route('/work')
  .get(function (req, res) {
    
    var sraId = req.query.email;

    //written in allocation.js
    Allocation.getComplaintId(sraId)
      .then(function (allocation) {
        console.log(allocation);
        complaintId = allocation.complaintId;
        console.log(complaintId);
        Complaint.getComplaintForSra(complaintId)
          .then(function (complaint) {
            res.send(complaint);
          })
          .catch(function (err) {
            console.log(err);
            res.json({
              error: err
            });
          });
      })
      .catch(function (err) {
        console.log(err);
        res.json({
          error: err
        });
      });
  })

module.exports = router;