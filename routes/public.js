var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var Path = require('path');
var Complaint = require('./../models/complaint');
var User = require('./../models/user');
var Image = require('./../models/photo.js');
var ComplaintValidation = require('./../complaintValidation');

var parseUrlencoded = bodyParser.urlencoded({
	extended: false
});

//for uploading images
var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './../publicImages');
	},
	filename: function (req, file, callback) {
		callback(null, Date.now() + /*Path.extname(file.originalname)*/ '.jpg');
	}
});

var upload = multer({
	storage: storage
});

router.route('/complaints/history')
	.get(function (req, res) {
		var email = req.query.email;
		console.log(email);
		User.findUserInstances(email)
			.then(function (user) {
				console.log(user);
				Complaint.find({
						email: user.email
					})
					.then(function (com) {
						res.send(com);
					})
					.catch(function (err) {
						console.log(err);
						res.json({
							error: err
						});
					});
			}).catch(function (err) {
				console.log(err);
				res.json({
					error: err
				});
			});
	})

router.route('/complaints/newComplaint')
	.all(bodyParser.json())
	.post(parseUrlencoded, upload.any(), function (req, res) {

		// user properties
		var userName = req.body.userName;
		var email = req.body.email;
		console.log(email);

		// complaint properties
		var area = req.body.location;
		var pincode = req.body.pincode;
		var geometry = req.body.geometry;
		var complaintId = req.body.complaintId;
		var description = req.body.description;
		var severity = req.body.severity;

		//image properties
		var filePath = req.files.path;

		var originalValue = ComplaintValidation.createComplaint(pincode, geometry);
		create(originalValue);
		/** */
		function create(originalValue) {
			var user = new User({
				email: email,
				userName: userName
			});

			User.addUser(user, function (err, user) {
				if (err) throw err;
				console.log(user);
			});
			var complaint = new Complaint({
				userId: user._id,
				complaintId: complaintId,
				description: description,
				severity: severity,
				//  status: status,
				area: area,
				pincode: pincode,
				geometry: geometry,
				orginal: originalValue
			});

			Complaint.createComplaint(complaint, function (err, complaint) {
				if (err) throw err;
				console.log(complaint);
			});

			var image = new Image({
				referenceId: complaint._id,
				//created: created,
				filePath: filePath
			});
			Image.addImage(image, function (err, image) {
				if (err) throw err;
				console.log(image);
			});
		}
	})

module.exports = router;