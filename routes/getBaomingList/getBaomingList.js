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

// var connection = mysql.createPool({
//     host: '39.106.140.80',
//     user: 'root',
//     password: 'Qihong38752673',
//     database: 'youyongba',
//     multipleStatements: true
// });


var connection = mysql.createPool({
    host: '39.106.140.80',
    user: 'root',
    password: 'Qihong38752673',
    database: 'youyongba'
});


/**
 * 查询列表数据
 */

const baomingInfo = (classId, tempCont) => {
    return new Promise(async function (resolve, reject) {
        var querySql = `select id,userId, avatar,user from baoming where classId = ${classId}`;

        await tempCont.query(`${querySql}`, async function (error, rows, fields) {

            tempCont.release();
            var data = null;
            if (!!error) {
                data = {
                    status: false,
                    data: []
                }
            } else {
                data = {
                    status: true,
                    data: rows
                }
            }
            resolve(data);

        });
    })


}

router.get('/', bodyParser.json(), function (req, res, next) {


    connection.getConnection(async function (error, tempCont) {
        tempCont.release();


        if (!!error) {
            tempCont.release();
        } else {

            var params = url.parse(req.url, true).query;

            let auth = req.headers.authorization;

            if (!auth || !auth.startsWith('Bearer')) {
                return res.status(401).json({
                    status: false,
                    msg: -1
                });
            } else {
                auth = auth.split('Bearer').pop().trim();
            }

            jwt.verify(auth, JWT_PASSWORD, (err, jwtData) => {
                if (err) {
                    return res.status(401).json({
                        status: false,
                        msg: -1
                    })
                } else {
                    baomingInfo(params.id, tempCont).then(function (msg) {
                        res.json(msg);
                    });
                }
            });

        }

    });


});

module.exports = router;