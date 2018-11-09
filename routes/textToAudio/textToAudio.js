var express = require('express');
var router = express.Router();


var app = express();
var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

let jwt = require('jsonwebtoken');
var JWT_PASSWORD = 'token';
const crypto = require('crypto');
const request = require('request');
const fs = require('fs');

const xfUrl = "http://api.xfyun.cn/v1/service/v1/tts"
const xfAppid = "5bbf9b42";
const xfApiKey = "5af95771bb7c1574f1ccc532871c530a";



router.get('/', bodyParser.json(), function(req, res, next) {
	// tts(res);
	res.json({
		status: false,
		msg: "执行失败",
		data: req.query
	});
})



// tts();
module.exports = router;