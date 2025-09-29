const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt'); // hash password

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please enter your email']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password']
    }
});

// hash password before save to database
UserSchema.pre('save', async function(next) {
    const user = this;
    
    bcrypt.hash(user.password, 10).then(hash => {
        user.password = hash;
        next();
    }).catch(error => {
        console.log(error);
    })
});

const User = mongoose.model('User', UserSchema);
module.exports = User;