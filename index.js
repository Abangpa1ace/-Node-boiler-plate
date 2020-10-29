const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const config = require('./config/key')
const { auth } = require('./middleware/auth')
const { User } = require("./models/User");

//application/x-www-form-urlencoded 분석
app.use(bodyParser.urlencoded({extended: true}));
//application/json 분석
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
const user = require('./models/User');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
}).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Initial Site'))

app.post('/api/user/register', (req, res) => {

    //회원가입에 필요한 정보들을 Client에서 가져오면
    //그것을 데이터베이스에 넣는다.

    const user = new User(req.body)

    user.save((err, doc) => {
        if(err) return res.json({
            success: false, err
        })
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/user/login', (req, res) => {
    
    //1. DB에서 요청한 email 찾기
    User.findOne({ email: req.body.email}, (err, user) => {
        if (!user) {
            return res.json ({
                loginSuccess: false,
                msg: "해당되는 이메일이 없습니다."
            })
        }

    //2. DB에 요청한 email 있다면, password 일치하는지
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json ({
                    loginSuccess: false,
                    msg: "비밀번호가 불일치합니다."
                })  
            }

    //3. password 일치하다면, Token 생성(JSONWEBTOKEN 라이브러리 활용)
            user.addToken((err, user) => {
                if(err) return res.status(400).send(err);

                //Token을 저장한다. 쿠키(cookie-parser) or 로컬스토리지 등
                res.cookie('saved_token', user.token)
                .status(200)
                .json( {
                    loginSuccess: true,
                    userId: user._id
                })
            })
        })
    })
})

app.get('/api/user/auth', auth, (req, res) => {      //auth는 middleware(주소와 cb함수 중간자)

    //isAuth: true, req.user & req.token 정보 넘어옴(메소드)
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false: true,
        isAuth: true.password,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/user/logout', auth, (req, res) => {
    
    User.findOneAndUpdate(
        {_id: req.user._id},
        {token: ""},
        (err, user) => {
            if(err) return res.json({success: false, err});
            return res.status(200).send({
                success: true
            })
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}`))