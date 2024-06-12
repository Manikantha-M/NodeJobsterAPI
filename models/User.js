const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{
        type:String, required:[true, 'Please provide a name'], minlength:3, maxlength:50
    },
    email:{
        type:String, required:[true, 'Please provide an email'], match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email'],
        unique: true
    },
    password:{
        type: String, required:[true, 'Please provide a password'], minlength:6
    },
    lastName: {
        type: String,
        trim: true,
        maxlength:20,
        default:'lastName'
    },
    location: {
        type: String,
        trim: true,
        maxlength:20,
        default:'my city'
    }
}, { collection: 'jobsteruser'});

userSchema.pre('save', async function(){
    if(!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})
userSchema.methods.getName = function() {
    return this.name;
}
userSchema.methods.createJWT = function() {
    return jwt.sign({userId:this._id, name:this.name}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_LIFETIME});
}

userSchema.methods.comparePassword = async function(pass){
    const isMatch = await bcrypt.compare(pass, this.password);
    return isMatch;
}

module.exports = mongoose.model('User', userSchema);