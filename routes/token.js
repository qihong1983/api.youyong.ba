var express = require('express');
var router = express.Router();

var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

let jwt = require('jsonwebtoken');
var JWT_PASSWORD = 'token';


// parse application/json
router.use(bodyParser.json());

var users = {
	username: "demouser",
	password: "demopass"
}

//设置跨域访问  
router.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	if ('OPTIONS' == req.method) {
		res.sendStatus(200);
	} else {
		next();
	}
});


router.post('/', bodyParser.json(), (req, res) => {

	console.log(req.body, 'req.body');



	res.header("Access-Control-Allow-Origin", "*"); //设置跨域访问 

	console.log(req.body);

	// console.log(res.status(), 'ccc');

	if (users.username != req.body.username || users.password != req.body.password) {
		res.status(401).json({
			status: false,
			msg: "登录失败！请检查用户名密码是否正确"
		})
	} else {

		// console.log(moment().second(30).unix() * 1000);

		console.log(Math.floor(Date.now() / 1000) + (60 * 60));

		res.json({
			status: true,
			msg: "登录成功",
			token: jwt.sign({
				username: req.body.username
			}, JWT_PASSWORD, {
				expiresIn: 60 * 30
				// expiresIn: '30 seconds'
			})
		})
	}
});

module.exports = router;