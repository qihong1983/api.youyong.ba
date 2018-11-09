const crypto = require('crypto');
const request = require('request');
const fs = require('fs');

const xfUrl = "http://api.xfyun.cn/v1/service/v1/tts"
const xfAppid = "5bbf9b42";
const xfApiKey = "5af95771bb7c1574f1ccc532871c530a";

function tts(name, text) {
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
		'text': '明天的天气怎么样'
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
		form: text.toString(),
		encoding: null
	}

	request(options, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			let headers = response.headers;
			if (headers["content-type"] == "audio/mpeg") {
				console.log("成功");

				fs.writeFile(name + ".wav", body, function(err) {
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

var arguments = process.argv.splice(2);

//////////////////////////
// print process.argv

console.log(arguments[0], arguments[1]);


tts(arguments[0], arguments[1]);