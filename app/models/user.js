// require
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    
        email   : String,
        password : String,
        name : String,
        admin: Boolean
    
});

// methods
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// initialization
userSchema.statics.init = function(){
    var User = this;
    
   this.count({}, function(err, count) {
       if (err)
           throw err;
        if(count === 0) {
         User.create("admin", "admin", true, function(){});
        }
   });
}

userSchema.statics.create = function(name, password, admin, done){
      // if there is no user with that email
        // create the user
        var newUser = new this();

        // set the user's local credentials
        newUser.name = name;
        newUser.password = newUser.generateHash(password);
        newUser.admin = admin;

        // save the user
        newUser.save(function(err) {
            if (err)
                throw err;
            return done(null, newUser);
        });
}

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);