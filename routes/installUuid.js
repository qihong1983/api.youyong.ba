var express = require('express');
var router = express.Router();

var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

let jwt = require('jsonwebtoken');
var JWT_PASSWORD = 'token';

var mysql = require('mysql');

function handleError(err) {
	if (err) {
		// 如果是连接断开，自动重新连接
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			connect();
		} else {
			console.error(err.stack || err);
		}
	}
}

// 连接数据库
function connect() {
	db = mysql.createConnection({
		host: '39.106.140.80',
		user: 'root',
		password: 'Qihong38752673',
		database: 'saoyisao'
	});
	db.connect(handleError);
	db.on('error', handleError);
}


var db;
connect();

router.post('/', bodyParser.json(), function(req, res, next) {

	res.header("Access-Control-Allow-Origin", "*"); //设置跨域访问 
	//SQL语句
	var sql = "INSERT INTO `saoyisao`.`saotoken` ( `uuid`) VALUES ('" + req.body.uuid + "')";

	db.query(sql, function(err, result) {

		console.log(err, 'err');

		if (err == null) {
			res.json({
				status: true,
				msg: "执行成功",
				data: req.body.uuid
			})
		} else {
			res.json({
				status: false,
				msg: "执行错误"
			})
		}

		console.log(result, 'result');

	});

});

module.exports = router;