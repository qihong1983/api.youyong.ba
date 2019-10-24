var express = require('express');
var router = express.Router();

var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

let jwt = require('jsonwebtoken');
var JWT_PASSWORD = 'token';

var mysql = require('mysql');

// parse application/json
router.use(bodyParser.json());

var users = {
	username: "demouser",
	password: "demopass"
}

var connection = mysql.createPool({
	host: '39.106.140.80',
	user: 'root',
	password: 'Qihong38752673',
	database: 'youyongba',
	multipleStatements: true
});



const queryPhone = (params, tempCont) => {
	return new Promise(async function (resolve, reject) {
		var querySql = `select id,username,phone,password, avatar from user where phone = ${params.phone} and password = ${params.password}`;

		await tempCont.query(`${querySql}`, async function (error, rows, fields) {
			tempCont.release();

			console.log(error, 'error');

			var data = null;
			if (!!error) {
				data = {
					status: false
				}
			} else {
				console.log(rows);

				if (rows.length != 0) {

					var obj = {};
					rows.map((v, k) => {

						obj.id = v.id;
						obj.username = v.username;

						obj.phone = v.phone;
						obj.avatar = v.avatar;


					});

					if (rows[0].password) {
						
						data = {
							status: true,
							data: obj
						}
					} else {
						data = {
							status: false
						}
					}

				} else {
					data = {
						status: false
					}
				}

			}
			resolve(data);
		});
	});
}


//设置跨域访问  
// router.all('*', function (req, res, next) {
// 	res.header('Access-Control-Allow-Headers', 'Content-Type');

// 	if ('OPTIONS' == req.method) {
// 		res.sendStatus(200);
// 	} else {
// 		next();
// 	}
// });

const clearPass = (phone, tempCont) => {
    var updataSql = `UPDATE user SET password = '' WHERE phone = ${phone}`;

    tempCont.query(`${updataSql}`, async function (error, rows, fields) {

        // tempCont.release();




    })
}

router.post('/', bodyParser.json(), (req, res) => {

	// res.header("Access-Control-Allow-Origin", "*"); //设置跨域访问 

	connection.getConnection(async function (error, tempCont) {
		if (!!error) {
			tempCont.release();
		} else {

			var params = req.body;

			console.log(params, 'params');

			queryPhone(params, tempCont).then(function (data) {

				console.log(data, 'data');

				setTimeout(function () {
					clearPass(data.phone, tempCont);
				}, 1000 * 120);

				if (data.status) {


					data.data.token = jwt.sign({
						phone: data.data.phone
					}, JWT_PASSWORD, {
						expiresIn: 60 * 30
						// expiresIn: '30 seconds'
					})
					res.status(200).json(data);

				} else {
					res.status(401).json(data);
				}


				// res.status(200).json(data);
				// if (data.status) {
				//查询到手机号了就改验证码


				// return updatePhonePassword(params.phone, tempCont, randomNum);
				// } else {
				//没有查询到手机号就插入这个新手机号

				// return insertPhoneUser(params.phone, tempCont, randomNum);

				// }
				// res.json(data);
			})


		}
	})


	// if (users.username != req.body.username || users.password != req.body.password) {
	// 	res.status(401).json({
	// 		status: false,
	// 		msg: "登录失败！请检查用户名密码是否正确"
	// 	})
	// } else {

	// 	// console.log(moment().second(30).unix() * 1000);

	// 	console.log(Math.floor(Date.now() / 1000) + (60 * 60));

	// 	res.json({
	// 		status: true,
	// 		msg: "登录成功",
	// 		token: jwt.sign({
	// 			username: req.body.username
	// 		}, JWT_PASSWORD, {
	// 			expiresIn: 60 * 30
	// 			// expiresIn: '30 seconds'
	// 		})
	// 	})
	// }
});

module.exports = router;