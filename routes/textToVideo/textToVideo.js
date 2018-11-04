var express = require('express');
var router = express.Router();

var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

let jwt = require('jsonwebtoken');
var JWT_PASSWORD = 'token';

var fs = require('fs');
var crypto = require('crypto');
var util = require('util');

var qs = require('querystring');


var axios = require('axios');
var post_data = {
	a: 123,
	time: new Date().getTime()
}; //这是需要提交的数据  



var content = qs.stringify(post_data);

// var options = {
// 	hostname: 'http://api.xfyun.cn/v1/service/v1/tts',
// 	port: 10086,
// 	path: '/pay/pay_callback',
// 	method: 'POST',
// 	headers: {
// 		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
// 	}
// };


var apiSecretKey = '1a3c1500ab253b636100c053e1ebea87';

var options = {
	"auf": "audio/L16;rate=16000",
	"aue": "raw",
	"voice_name": "xiaoyan",
	"speed": "50",
	"volume": "50",
	"pitch": "50",
	"engine_type": "intp65",
	"text_type": "text"
};


// console.log(JSON.stringify(options));


// var xParam = JSON.stringify(options).toString('base64');

var xParam = new Buffer(JSON.stringify(options)).toString('base64')
console.log(xParam, 'xParam');

var xCurTime = Math.floor((new Date()).valueOf() / 1000);
var md5 = crypto.createHash("md5");
var xCheckSum = md5.update(API_KEY + xCurTime + xParam).digest("hex");

var currentText = '科大讯飞的接口文档写的太烂了';
var APPID = '5bbf9b42';
var API_KEY = '5af95771bb7c1574f1ccc532871c530a';


var headers = {
	"X-Appid": APPID,
	"X-CurTime": xCurTime,
	"X-Param": xParam,
	"X-CheckSum": xCheckSum,
	"Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
}


axios({
	method: 'post',
	url: 'http://api.xfyun.cn/v1/service/v1/tts',
	headers: headers,
	data: 'text=' + encodeURIComponent(currentText)
}).then(res => {

	console.log(res.data);
	if (res.headers['content-type'] == 'audio/mpeg') {
		fs.writeFileSync(xCheckSum + '.wav', res.data, {
			encoding: 'binary',
			flag: 'w+'
		})
	}
}).catch(err => {
	console.log(err)
})
// JSON.stringify(options.toString('base64'));

// var req = http.request(options, function(res) {
// 	console.log('STATUS: ' + res.statusCode);
// 	console.log('HEADERS: ' + JSON.stringify(res.headers));
// 	res.setEncoding('utf8');
// 	res.on('data', function(chunk) {
// 		console.log('BODY: ' + chunk);
// 	});
// });

// req.on('error', function(e) {
// 	console.log('problem with request: ' + e.message);
// });

// // write data to request body  
// req.write(content);

// req.end();

// console.log(options)

// router.get('/', bodyParser.json(), function(req, res, next) {



// });

// module.exports = router;