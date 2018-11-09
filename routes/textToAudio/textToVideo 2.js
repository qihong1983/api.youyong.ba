const crypto = require('crypto');
const request = require('request');
const fs = require('fs');

const xfUrl = "http://api.xfyun.cn/v1/service/v1/tts"
const xfAppid = "5bbf9b42";
const xfApiKey = "5af95771bb7c1574f1ccc532871c530a";

function tts(arr) {
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
		form: sendtext,
		encoding: null
	}

	request(options, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			let headers = response.headers;
			if (headers["content-type"] == "audio/mpeg") {
				console.log("成功");

				fs.writeFile("audio.wav", body, function(err) {
					if (err)
						return console.error(err);
				})
			} else {
				console.log(response.body);
			}
		} else {
			console.log(error);
		}
	});
}

tts();