var mongoose = require('mongoose');

var repairProgressSchema = new mongoose.Schema({
    complaintId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'complaint'
        //required:true
    },
    description: {
        type: String,
        //required: true,
    },
    filesPath: {
        type: String,
        //required:true
    },
    sentTo: {
        type: String,
        //required:true
    },
    status: {
        type: Number,
        //required:true
    },
}, {
    timestamps: true
});

var RepairProgress = module.exports = mongoose.model('RepairProgress', repairProgressSchema);

//for getting updates for sma
module.exports.getUpdates = function (complaintId) {
    return RepairProgress.find({complaintId: complaintId});
};

//for adding updates by sra
module.exports.addRepairProgress = function (newRepairProgress) {
    return newRepairProgress.save();
};

