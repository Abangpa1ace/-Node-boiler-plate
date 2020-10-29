const { User } = require('../models/User')

let auth = (req, res, next) => {

    //인증 처리를 하는 코드

    //1. Client 쿠키에서 토큰 가져옴
    let token = req.cookies.saved_token;

    //2. token 복호화 후 DB에서 유저를 찾음
    User.findByToken(token, (err, user) => {
        if (err) throw err;

    //3. 유저가 있으면 인증 Yes, 없으면 No!
        if (!user) return res.json({
            isAuth: false,
            error: true
        })

        req.user = user;
        req.token = token;
        next()      //middleware가 끝난 뒤, (req, res)로 넘어갈 수 있게
    })
}

module.exports = { auth };