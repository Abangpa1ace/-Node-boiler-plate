const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');

const config = require('./config/key')

const { User } = require("./models/User");

//application/x-www-form-urlencoded 분석
app.use(bodyParser.urlencoded({extended: true}));
//application/json 분석
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
}).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))



app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', (req, res) => {

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

app.post('/login', (req, res) => {
    
    //1. DB에서 요청한 email 찾기
    User.findOne({ email: req.body.email}, (err, userInfo) => {
        if (!userInfo) {
            return res.json ({
                loginSuccess: false,
                msg: "해당되는 이메일이 없습니다."
            })
        }
    })
    //2. DB에 요청한 email 있다면, password 일치하는지

    //3. password 일치하다면, Token 생성

})

app.listen(port, () => console.log(`Example app listening on port ${port}`))