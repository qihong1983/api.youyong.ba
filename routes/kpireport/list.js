var express = require('express');
var router = express.Router();

var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

let jwt = require('jsonwebtoken');
var JWT_PASSWORD = 'token';


router.post('/', bodyParser.json(), function(req, res, next) {

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
				"msg": "返回成功1123",
				"username": data,
				"data": [{
					"id": 1,
					"appCode": "ios",
					"channelType": "netease_open",
					"online": "online"
				}, {
					"id": 2,
					"appCode": "Android",
					"channelType": "yun_123",
					"online": "444,123"
				}, {
					"id": 3,
					"appCode": "Android",
					"channelType": "easemob",
					"online": "offline"
				}]
			})
		}

		// const columns = [{
		// 	title: '操作系统',
		// 	dataIndex: 'appCode',
		// 	key: 'appCode',
		// }, {
		// 	title: '渠道类型',
		// 	dataIndex: 'channelType',
		// 	key: 'channelType',
		// }, {
		// 	title: '线上线下',
		// 	dataIndex: 'online',
		// 	key: 'online',
		// }];



	});


});

module.exports = router;