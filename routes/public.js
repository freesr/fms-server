var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var Path = require('path');
var Complaint = require('./../models/complaint');
var User = require('./../models/user');
var Image = require('./../models/photo.js');

var parseUrlencoded = bodyParser.urlencoded({
	extended: false
});

//for uploading images
var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, 'E:/c down/vayufinal/Images1');
	},
	filename: function (req, file, callback) {
		callback(null, Date.now() + /*Path.extname(file.originalname)*/ '.jpg');
	}
});

var upload = multer({
	storage: storage
});


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

		// Duplicate validation
		Complaint.find({
			pincode: pincode
		}).then(function (dataarray) {

			if (dataarray.length == 0) {
				com();
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
							orginal: false
						});

						Complaint.createComplaint(complaint, function (err, complaint) {
							if (err) throw err;
							console.log(complaint);
						});


						break;
					} else {
						if (i == dataarray.length - 1) {
							com();
						}
					}
				}
			}
		}).catch(function (err) {
			console.log(err);
		});


		function degreesToRadians(degrees) {
			return degrees * Math.PI / 180;
		}

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
		}

		function com() {
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
				orginal: true
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
	});
module.exports = router;
