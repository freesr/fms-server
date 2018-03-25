var mongoose = require('mongoose');
var allocationSchema = new mongoose.Schema({

  allocatedBy: {
    type: String,
    //required: true,

  },
  allocatedTo: {
    type: String,
    //required:true,

  },
  /*
  allocatedOn:{
    type:Date,
    default:Date.now
  },
  */

  receiverType: {
    type: String,
    default: "sra"
    //required:true,
  },
  /*statusOfAllocation:{
    type:Number,
    require:true
  },
  */
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'complaint'
    //required:true,
  },
  estimatedTime: {
    type: Number
  },

},{timestamps: true});


var Allocation = module.exports = mongoose.model('Allocation', allocationSchema);

module.exports.assignToSRA = function(complaintId,sraId, smaId) {

var allocation = new Allocation({
  complaintId: complaintId,
  allocatedBy: smaId,
  allocatedTo: sraId
});
    return allocation.save();
};

module.exports.getComplaintId = function(sraId) {
  console.log(sraId);
  return Allocation.findOne().where({'allocatedTo' : sraId});

};
