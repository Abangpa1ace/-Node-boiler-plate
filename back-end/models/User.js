const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken')

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

userSchema.methods.addToken = function(cb) {
    var user = this;

    //jsonwebtoken 이용해서 Token 생성
    var token = jwt.sign(user._id.toHexString(), 'token')
    // user._id + 'token' = token
    // ->
    // 'token' => user._id

    user.token = token
    user.save(function(err, user) {
        if (err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this

    //토큰 decode
    jwt.verify(token, 'saved_token', function(err, decoded) {

        //유저 아이디(decoded)로 DB에서 찾은뒤, 그 token이 client token과 일치하는지 확인
        user.findOne({ 
            "_id": decoded,
            "token": token
        }, function(err, user) {
            if (err) return cb(err);
            cb(null, user)
        })
    })
}
// * 메소드 만드는건 Schema 모델화 전

const User = mongoose.model('User', userSchema)

module.exports = { User }