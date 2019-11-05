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


router.post('/', bodyParser.json(), function (req, res, next) {


    connection.getConnection(async function (error, tempCont) {
        if (!!error) {
            tempCont.release();
        } else {

            console.log(req.body, 'req.bodyreq.bodyreq.body');
            let auth = req.headers.authorization;
            if (!auth || !auth.startsWith('Bearer')) {
                return res.status(401).json({
                    status: false,
                    msg: -1
                });
            } else {
                auth = auth.split('Bearer').pop().trim();
            }

            console.log(auth, 'authauth');

            jwt.verify(auth, JWT_PASSWORD, (err, jwtData) => {
                if (err) {
                    return res.status(401).json({
                        status: false,
                        msg: -1
                    })
                } else {
                    // baomingInfo(params.id, tempCont).then(function (msg) {
                    //     res.json(msg);
                    // });

                    queryBaoming(req.body, tempCont).then(function (msg) {
                        if (msg.status) {
                            return baomingOk(req.body, tempCont);
                        } else {
                            res.json(msg);
                        }
                    }).then(function (msg) {
                        res.json(msg);
                    })



                }
            });

        }
    })
});

module.exports = router;