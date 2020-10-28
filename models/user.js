const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        minlength: 5,
    },
    lastname: {
        type: String,
        maxlength: 50,
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number,
    }
})

userSchema.pre('save', function( next ) {
    let user = this;

    if (user.isModified('password')) {
    //비밀번호 암호화
    bcrypt.genSalt(saltRounds, function(err, salt) {

            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err)

                user.password = hash
                next()
            })
        });
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {

    //planePassword = 1234567 - 암호화 password $2b$10$~~ (비교)
    //plane을 암호화해서 비교. 암호화 password 해석은 불가능
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }