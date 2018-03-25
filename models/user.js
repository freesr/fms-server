var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({

  userType: {
    type: String,
    //required: true
  },
  email: {
    type: String,
    //  match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    //required: true,
    //unique: true
  },
  userName: {
    type: String
    //required: true
  },
 
}, {
  timestamps: true
});

var User = module.exports = mongoose.model('User', userSchema);

//for adding users into user collection
module.exports.addUser = function(newUser, callback) {
  newUser.save(callback);
};

//for finding complaints postedby users
module.exports.findUserInstances = function(mail) {
  console.log(mail + " in models");
  return User.find().where({'email' : mail});
};
