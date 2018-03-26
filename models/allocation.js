var mongoose = require('mongoose');

var allocationSchema = new mongoose.Schema({

  //sma email
  allocatedBy: {
    type: String
    //required: true
  },
  //sra email
  allocatedTo: {
    type: String
    //required:true
  },
  /*
    receiverType: {
      type: String,
      default: "sra"
      //required:true,
    },
  */
  //status of work
  status: {
    type: Number
    //srequired:true
  },
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'complaint'
    //required:true
  },
  estimatedTime: {
    type: Number
    //required: true
  },
}, {
  timestamps: true
});

var Allocation = module.exports = mongoose.model('Allocation', allocationSchema);

//for assigning work to sra
module.exports.assignToSRA = function (complaintId, sraId, smaId) {

  var allocation = new Allocation({
    complaintId: complaintId,
    allocatedBy: smaId,
    allocatedTo: sraId
  });
  return allocation.save();
};

//for sra to get complaint details
module.exports.getComplaintId = function (sraId) {
  return Allocation.findOne({
    'allocatedTo': sraId
  });
};

//for sra to send estimated time
module.exports.updateEstimatedTime = function (complaintId, estimatedTime) {
  return Allocation.findOneAndUpdate({
    complaintId: complaintId
  }, {
    $set: {
      estimatedTime: estimatedTime
    }
  }, {
    new: true
  });
};

//for sra to send completion response
module.exports.updateCompletionStatus = function (complaintId, status) {
  return Allocation.findOneAndUpdate({
    complaintId: complaintId
  }, {
    $set: {
      status: status
    }
  }, {
    new: true
  });
};