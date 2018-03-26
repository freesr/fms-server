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
  status:{
    type:Number,
    require:true
  },
  
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

module.exports.putAllocation=function(complaintId,estimatedTime){
  console.log(estimatedTime);
  return Allocation.findOneAndUpdate({complaintId: complaintId},{$set:{estimatedTime:estimatedTime}},{new: true});
};

module.exports.putAllocationStatus=function(complaintId,status){
  //console.log(estimatedTime);
  return Allocation.findOneAndUpdate({complaintId: complaintId},{$set:{status: status}},{new: true});
};
/*
module.exports.putAllocation=function(complaintId,estimatedtime){
  console.log(estimatedtime);
  
  //return Allocation.findOneAndUpdate({complaintId: complaintId},{$set:{estimatedtime:estimatedtime}},{new: true});
};
*/

//module.exports.getAllocByCompId=function(complaintId){
//return  Allocation.findOne({complaintId:complaintId});
//};