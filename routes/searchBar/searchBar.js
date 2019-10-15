var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
var JWT_PASSWORD = 'token';

var mysql = require('mysql');

const Mock = require('mockjs');

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





router.get('/', bodyParser.json(), function (req, res, next) {

    connection.getConnection(async function (error, tempCont) {
        if (!!error) {
            tempCont.release();
        } else {

            // console.log(req);

            var params = url.parse(req.url, true).query;
            console.log(params, 'params');

            console.log(params.page, 'params.page');

            console.log(params.lang, 'params.lang');

            console.log(params.lang == 'cn', '相等吗');

            if (params.lang == 'cn') {
                console.log(1);
                var sql = `select id, title, pinyin from list where title like '%${params.searchName}%' order by id desc limit 0, 10`;
            } else {
                console.log(2);
                var sql = `select id, title, pinyin from list where pinyin like '%${params.searchName}%' order by id desc limit 0, 10`;
            }
            
            console.log(sql, 'sql');
                


            // console.log(sql);
            var dataTmp = null;
            var queryData = await tempCont.query(`${sql}`, async function (error, rows, fields) {

                console.log('here');
                tempCont.release();
                console.log('here1');


                if (!!error) {
                    console.log("Error in the query");

                    var data = {
                        status: false,
                        msg: 'error',
                        data: error
                    }

                } else {
                    console.log('here3');

                    console.log(rows);
                    var data = {
                        status: true,
                        msg: 'success',
                        data: rows
                    }
                    res.json(data);
                    dataTmp = data;
                    return data;

                }
            });

            // console.log(queryData, 'queryData');
            // console.log(dataTmp, 'dataTmp');
        }
    });




    // res.json({
    //     "status": false
    // });

});


module.exports = router;