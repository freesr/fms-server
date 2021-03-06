var mongoose = require('mongoose');
var path = require('path');

var imageSchema = new mongoose.Schema({
    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'complaint',
        required: true
    },
    created: {
        type: Date,
    },
    filePath: [{
        type: String
    }],
}, {
    timestamps: true
});

var Image = module.exports = mongoose.model('Image', imageSchema);

//for adding photos
module.exports.addImage = function (image, callback) {
    image.save(callback);
};