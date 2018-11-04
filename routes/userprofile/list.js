var express = require('express');
var router = express.Router();

var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

let jwt = require('jsonwebtoken');
var JWT_PASSWORD = 'token';


router.get('/', bodyParser.json(), function(req, res, next) {


	// res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
	// res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
	// res.setHeader("Expires", "0");


	let auth = req.headers.authorization;

	// console.log(auth);

	// req.body.username
	// console.log(req.body.firstParam);
	if (!auth || !auth.startsWith('Bearer')) {
		return res.status(401).json({
			status: false,
			msg: -1
		});
	} else {
		auth = auth.split('Bearer').pop().trim();
	}

	jwt.verify(auth, JWT_PASSWORD, (err, data) => {
		if (err) {
			return res.status(401).json({
				status: false,
				msg: -1
			})
		} else {
			res.json({
				"status": true,
				"msg": "返回成功",
				"data": [{
					"id": 1,
					"date": "2017-05-17",
					"newUsers": "534,123",
					"activeUser": "444,123"
				}, {
					"id": 2,
					"date": "2017-05-18",
					"newUsers": "1,123",
					"activeUser": "14,432"
				}, {
					"id": 3,
					"date": "2017-05-19",
					"newUsers": "21,123",
					"activeUser": "114,123"
				}]
			})
		}



	});


});

module.exports = router;