var express = require('express');
var router = express.Router();

var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

let jwt = require('jsonwebtoken');
var JWT_PASSWORD = 'token';


router.get('/', bodyParser.json(), function(req, res, next) {

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
			"activeUser": "14,123"
		}, {
			"id": 3,
			"date": "2017-05-19",
			"newUsers": "21,123",
			"activeUser": "114,123"
		}]
	})


});

module.exports = router;