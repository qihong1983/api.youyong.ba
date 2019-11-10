require('isomorphic-unfetch');
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


/**
 * 查询列表数据
 */

const baomingOk = (data, tempCont) => {
    return new Promise(async function (resolve, reject) {
        // var querySql = `select id,avatar,user from baoming where classId = ${classId}`;
        var sql = `INSERT INTO baoming (id,userid, classId, avatar, user) VALUES (NULL, "${data.userId}","${data.classId}", "${data.avatar}", "${data.userName}")`;

        await tempCont.query(`${sql}`, async function (error, rows, fields) {

            // tempCont.release();
            var data = null;
            if (!!error) {
                console.log(error, 'error');

                data = {
                    status: false
                }
            } else {
                console.log(555);
                data = {
                    status: true
                }


            }


            resolve(data);

        });
    })


}

const queryBaoming = (data, tempCont) => {
    return new Promise(async function (resolve, reject) {

        var querySql = `select id,userid,avatar,user from baoming where classId = ${data.classId} and userid = ${data.userId}`;

        await tempCont.query(`${querySql}`, async function (error, rows, fields) {
            tempCont.release();

            var data = null;
            if (!!error) {
                console.log(error, 'error');

                data = {
                    status: false
                }
            } else {
                console.log(555);

                if (rows.length != 0) {

                    data = {
                        status: false
                    }
                } else {
                    data = {
                        status: true
                    }
                }
            }

            resolve(data);
        })

    })

}


const getAccessToken = (data, tempCont) => {
    return new Promise(async function (resolve, reject) {

        console.log(data, 'datadatadata');

        let res = await fetch(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxdbb117c79cfbdea7&secret=c5253dbce83f03b45bb2eb3ba8f2d1c4&code=${data.code}&grant_type=authorization_code`, {
            // let res = await fetch(`http://localhost:8081/list?page=${data.offset - 1}&keyword=${encodeURI(data.keyword)}`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded'
            }

        });

        console.log(11111);

        var json = await res.json();

        console.log(22222);
        console.log(json, 'getAccessToken');


        var returnData = {};
        if (json.errcode) {
            returnData.status = false;
        } else {
            returnData.status = true;
            returnData.data = json;
        }

        resolve(returnData);


        console.log(json, '看看成没成功');
    })

}

const getUserInfo = (access_token, openid) => {
    return new Promise(async function (resolve, reject) {

        let res = await fetch(`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        var json = await res.json();

        console.log(json, 'getUserInfo');

        var data = {};
        if (json.errcode) {
            data.status = false;
        } else {
            data.status = true;
            data.data = json;
        }

        resolve(data);

    })
}

router.post('/', bodyParser.json(), function (req, res, next) {
    connection.getConnection(async function (error, tempCont) {
        if (!!error) {
            tempCont.release();
        } else {


            console.log(req.body, 'req.bodyreq.bodyreq.body');

            // console.log(fetch, '看看是什么');


            var data = {
                code: req.body.code,
                state: req.body.state
            }

            getAccessToken(data, tempCont).then(function (msg) {
                console.log(msg.data);
                if (msg.status) {

                    // msg.data.access_token
                    //https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID

                    return getUserInfo(msg.data.access_token, msg.data.openid);
                }

            }).then(function (msg) {

                console.log(msg, 'msgsmsgmsgmsgmsgmsgmsgmsg');
            });






        }
    })
});

module.exports = router;