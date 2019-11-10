var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const Core = require('@alicloud/pop-core');
let jwt = require('jsonwebtoken');
var JWT_PASSWORD = 'token';

var mysql = require('mysql');

const Mock = require('mockjs');

var Random = Mock.Random;
var url = require('url');

var connection = mysql.createPool({
    host: '39.106.140.80',
    user: 'root',
    password: 'Qihong38752673',
    database: 'youyongba',
    multipleStatements: true
});

// console.log(connection);
// connection.connect();
// connection.connect(function (error) {
//     if (!!error) {
//         console.log('Error');
//     } else {
//         console.log('Connected');
//     }
// });



/**
 * 
 * @param {*} phone 
 * @param {*} tempCont 
 * @param {*} randomNum 
 */


//没有查询到手机号就插入这个新手机号
const insertPhoneUser = (phone, tempCont, randomNum) => {

    console.log(111);
    return new Promise(async function (resolve, reject) {
        var sql = `INSERT INTO user (id, username, password, avatar, phone) VALUES (NULL, "${Mock.mock('@word(5)')}", "${randomNum}", "${Random.image('100x100', Mock.mock('@color'), '#FFF', Mock.mock('@cword()'))}", ${phone})`;
        console.log(222);

        await tempCont.query(`${sql}`, async function (error, rows, fields) {

            console.log(333);
            if (!!error) {
                console.log(error, 'error');

                var data = {
                    status: false
                }
            } else {
                console.log(555);
                var data = {
                    status: true
                }


            }


            resolve(data);
        });

    });
}
/**
 * 如果查询到就更新密码
 */

const updateUserInfo = (data, phone, tempCont) => {
    return new Promise(async function (resolve, reject) {
        var updataSql = `UPDATE user SET username = "${data.username}", avatar = "${data.avatar}" WHERE phone = ${phone}`;

        await tempCont.query(`${updataSql}`, async function (error, rows, fields) {

            // tempCont.release();

            console.log(error, 'error');
            console.log(rows, 'rows');
            if (!!error) {
                var data = {
                    status: false
                }
            } else {
                var data = {
                    status: true
                }
                resolve(data);

            }


        })
    })
}


const updateUserInfoUnionid = (data, unionid, tempCont) => {
    return new Promise(async function (resolve, reject) {
        var updataSql = `UPDATE user SET username = "${data.username}", avatar = "${data.avatar}" WHERE unionid = "${unionid}"`;

        await tempCont.query(`${updataSql}`, async function (error, rows, fields) {

            // tempCont.release();

            console.log(error, 'error');
            console.log(rows, 'rows');
            if (!!error) {
                var data = {
                    status: false
                }
            } else {
                var data = {
                    status: true
                }
                resolve(data);

            }


        })
    })
}


/**
 * 查询看看这个手机号存不存在
 */

const queryPhone = (phone, tempCont) => {

    // connection.getConnection(async function (error, tempCont) {
    //     if (!!error) {
    //         tempCont.release();
    //     } else {
    return new Promise(async function (resolve, reject) {

        // var params = url.parse(req.url, true).query;

        var querySql = `select phone from user where phone = ${phone}`;

        await tempCont.query(`${querySql}`, async function (error, rows, fields) {
            tempCont.release();

            var data = null;
            if (!!error) {
                data = {
                    status: false
                }
            } else {
                console.log(rows);
                if (rows.length != 0) {
                    data = {
                        status: true
                    }
                } else {
                    data = {
                        status: false
                    }
                }

            }
            resolve(data);
        })

    })
}


// });
// }


const clearPass = (phone, tempCont) => {
    var updataSql = `UPDATE user SET password = '' WHERE phone = ${phone}`;

    tempCont.query(`${updataSql}`, async function (error, rows, fields) {

        // tempCont.release();




    })
}

router.post('/', bodyParser.json(), function (req, res, next) {

    connection.getConnection(async function (error, tempCont) {
        if (!!error) {
            tempCont.release();
        } else {

            console.log(req.body, 'yyy');

            var data = req.body;

            let auth = req.headers.authorization;

            if (!auth || !auth.startsWith('Bearer')) {
                return res.status(401).json({
                    status: false,
                    msg: -1
                });
            } else {
                auth = auth.split('Bearer').pop().trim();
            }

            console.log(auth, '*****');

            jwt.verify(auth, JWT_PASSWORD, (err, jwtData) => {
                if (err) {
                    return res.status(401).json({
                        status: false,
                        msg: -1
                    })
                } else {
                    console.log(jwtData, 'jwtDatajwtData');
                    if (jwtData.unionid) {
                        updateUserInfoUnionid(data, jwtData.unionid, tempCont).then(function (msg) {
                            res.json(msg);
                            setTimeout(function () {
                                clearPass(jwtData.phone, tempCont);
                            }, 1000 * 120);
                        })
                    } else {
                        updateUserInfo(data, jwtData.phone, tempCont).then(function (msg) {
                            res.json(msg);
                            setTimeout(function () {
                                clearPass(jwtData.phone, tempCont);
                            }, 1000 * 120);
                        })
                    }

                }



            });





            // var params = url.parse(req.url, true).query;

            // if (!params.phone) {
            //     res.json({ "status": false, "msg": "手机号不能为空" });
            // }

            // var randomNum = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);






        }
    });





});


module.exports = router;