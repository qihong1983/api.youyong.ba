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
        var sql = `INSERT INTO user (id, username, password, avatar, phone) VALUES (NULL, "${Mock.mock('@word(5)')}", "${randomNum}", "${Random.image('100x100', Mock.mock('@color'), '#FFF', 'U')}", ${phone})`;
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

const updatePhonePassword = (phone, tempCont, randomNum) => {
    return new Promise(async function (resolve, reject) {
        var updataSql = `UPDATE user SET password = ${randomNum} WHERE phone = ${phone}`;

        await tempCont.query(`${updataSql}`, async function (error, rows, fields) {

            // tempCont.release();

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


const clearPass = (phone, tempCont, randomNum) => {
    var updataSql = `UPDATE user SET password = '' WHERE phone = ${phone}`;

    tempCont.query(`${updataSql}`, async function (error, rows, fields) {

        // tempCont.release();




    })
}

router.get('/', bodyParser.json(), function (req, res, next) {

    connection.getConnection(async function (error, tempCont) {
        if (!!error) {
            tempCont.release();
        } else {



            var params = url.parse(req.url, true).query;

            if (!params.phone) {
                res.json({ "status": false, "msg": "手机号不能为空" });
            }



            var randomNum = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);




            queryPhone(params.phone, tempCont).then(function (data) {

                if (data.status) {
                    //查询到手机号了就改验证码

                    return updatePhonePassword(params.phone, tempCont, randomNum);
                } else {
                    //没有查询到手机号就插入这个新手机号

                    return insertPhoneUser(params.phone, tempCont, randomNum);

                }
                // res.json(data);
            }).then(function (data) {

                var client = new Core({
                    accessKeyId: 'LTAIML0c4KUngOmA',
                    accessKeySecret: 'gbkS2o8UtIVAhs5TovJFHT3SoE2MVX',
                    endpoint: 'https://dysmsapi.aliyuncs.com',
                    apiVersion: '2017-05-25'
                });

                var smsParams = {
                    "RegionId": "cn-hangzhou",
                    "PhoneNumbers": params.phone,
                    "SignName": "游泳吧",
                    "TemplateCode": "SMS_175531301",
                    "TemplateParam": `{\"code\": ${randomNum}}`,
                    "OutId": "18600190151"
                }

                var requestOption = {
                    method: 'POST'
                };

                client.request('SendSms', smsParams, requestOption).then((result) => {
                    console.log(JSON.stringify(result));
                    var data = {
                        status: true,
                        data: result
                    }

                    setTimeout(function () {
                        clearPass(params.phone, tempCont, randomNum);
                    }, 1000 * 120);
                    res.json(data);
                }, (ex) => {
                    var data = {
                        status: false,
                        data: ex
                    }
                    console.log(ex);
                    res.json(data)
                })


                // res.json(data);


            })






            // var client = new Core({
            //     accessKeyId: 'LTAIML0c4KUngOmA',
            //     accessKeySecret: 'gbkS2o8UtIVAhs5TovJFHT3SoE2MVX',
            //     endpoint: 'https://dysmsapi.aliyuncs.com',
            //     apiVersion: '2017-05-25'
            // });

            // var smsParams = {
            //     "RegionId": "cn-hangzhou",
            //     "PhoneNumbers": params.phone,
            //     "SignName": "游泳吧",
            //     "TemplateCode": "SMS_175531301",
            //     "TemplateParam": `{\"code\": ${randomNum}}`,
            //     "OutId": "18600190151"
            // }

            // var requestOption = {
            //     method: 'POST'
            // };

            // client.request('SendSms', smsParams, requestOption).then((result) => {
            //     console.log(JSON.stringify(result));
            // }, (ex) => {
            //     console.log(ex);
            // })

        }
    });





});


module.exports = router;