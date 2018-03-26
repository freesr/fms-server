
var mongoose = require('mongoose');

//creating updates schema
//include photo
var repairProgressSchema = new  mongoose.Schema({
    description: {
        type: String,
        //required: true,

    },
    filesPath: {
        type: String,
        //required:true
    },
    /*
    updatedOn:{
      type:Date,
      default:Date.now
    },
    */
    sentTo:{
      type:String,
        //required:true
    },
    status:{
      type:Number,
        //required:true
    },
   

},{timestamps:true});
var RepairProgress = module.exports = mongoose.model('RepairProgress', repairProgressSchema);

//for adding updates to updates collection


//for submitting updates to sma
module.exports.getUpdates = function(callback) {
    Update.find(callback);
};

module.exports.addRepairProgress=function(newRepairProgress)
{
  return newRepairProgress.save();
};
