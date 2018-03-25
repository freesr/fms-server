
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost:27017/fmsDB');
var db = mongoose.connection;

// general public
var public = require('./routes/public');
app.use('/public', public);

// SRA: Sight Repair Agency
var sra = require('./routes/sra');
app.use('/sra', sra);

// SMA: Sight Maintenance Authority
var sma = require('./routes/sma');
app.use('/sma', sma);

module.exports = app;
