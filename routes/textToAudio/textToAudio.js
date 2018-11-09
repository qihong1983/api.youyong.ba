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

// function tts(res) {
// 	var jsonOri = {
// 		"auf": "audio/L16;rate=16000",
// 		"aue": "raw",
// 		"voice_name": "xiaoyan",
// 	};
// 	var param = Buffer.from(JSON.stringify(jsonOri)).toString('base64');
// 	console.log(param)
// 	var curTime = Date.parse(new Date()).toString().slice(0, -3);
// 	var checkSum = crypto.createHash('md5').update(xfApiKey + curTime + param).digest('hex');
// 	let sendtext = {
// 		'text': '的过程。每个周期，投诉都围绕进展。整个团队正致力于改进流程，但我觉得仍有工作要做。老实说，谷歌不再是一个小的初创公司，在一个8万人的大公司中寻找平衡很难。这让我想到了 Google Cloud。'
// 	}

// 	var audio = '';
// 	var options = {
// 		url: xfUrl,
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
// 			"X-Param": param,
// 			"X-Appid": xfAppid,
// 			"X-CurTime": curTime,
// 			"X-CheckSum": checkSum,
// 		},
// 		form: res.query.text,
// 		encoding: null
// 	}

// 	request(options, function(error, response, body) {
// 		if (!error && response.statusCode == 200) {
// 			let headers = response.headers;
// 			if (headers["content-type"] == "audio/mpeg") {
// 				console.log("成功");

// 				fs.writeFile("../../public/audio.wav", body, function(err) {



// 					if (err) {
// 						// return console.error(err);

// 						res.json({
// 							status: false,
// 							msg: "执行失败",
// 							data: err
// 						})
// 						// return false;
// 					} else {
// 						res.json({
// 							status: true,
// 							msg: "执行成功",
// 							data: 'https://api.youyong.ba/audio.wav'
// 						})
// 					}
// 				})
// 			} else {
// 				console.log(response.body);
// 			}
// 		} else {
// 			console.log(error);
// 		}
// 	});
// }


router.use(async function(req, res, next) {

	console.log(req.query);
	var jsonOri = {
		"auf": "audio/L16;rate=16000",
		"aue": "raw",
		"voice_name": "xiaoyan",
	};
	var param = Buffer.from(JSON.stringify(jsonOri)).toString('base64');
	console.log(param)
	var curTime = Date.parse(new Date()).toString().slice(0, -3);
	var checkSum = crypto.createHash('md5').update(xfApiKey + curTime + param).digest('hex');
	let sendtext = {
		'text': '的过程。每个周期，投诉都围绕进展。整个团队正致力于改进流程，但我觉得仍有工作要做。老实说，谷歌不再是一个小的初创公司，在一个8万人的大公司中寻找平衡很难。这让我想到了 Google Cloud。'
	}

	var audio = '';
	var options = {
		url: xfUrl,
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
			"X-Param": param,
			"X-Appid": xfAppid,
			"X-CurTime": curTime,
			"X-CheckSum": checkSum,
		},
		form: req.query.text,
		encoding: null
	}

	await request(options, async function(error, response, body) {


		if (!error && response.statusCode == 200) {

			console.log(4444444444);
			console.log(req.query.text, '44444444444444444444');

			let headers = response.headers;

			console.log(headers["content-type"]);
			// if (headers["content-type"] == "audio/mpeg") {
			console.log("成功");

			await fs.writeFile("../../public/audio.wav", body, async function(err) {

				console.log(body, '#####');

				if (err) {
					return console.error(err);

					await res.json({
						status: false,
						msg: "执行失败",
						data: err
					})
					// return false;
				} else {
					await res.json({
						status: true,
						msg: "执行成功",
						data: 'https://api.youyong.ba/audio.wav',
						aaa: '11'
					})
				}
			})
			// } else {
			// 	console.log(123);
			// 	console.log(response.body);
			// }
		} else {
			console.log('333333333333333333333333');
			console.log(error);
		}
	});
});


router.get('/', bodyParser.json(), function(req, res, next) {

	// tts(res);
	// res.json({
	// 	status: false,
	// 	msg: "执行失败",
	// 	data: req.query
	// })

	next();

	// tts(res);
	// res.json({
	// 	status: false,
	// 	msg: "执行失败",
	// 	data: req.query
	// })

})



// tts();
module.exports = router;