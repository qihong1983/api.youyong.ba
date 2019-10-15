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


            var count = `select count(*) from list`;


            params.keyword = params.keyword.replace(/\s/g, "");

            let lang = "cn";
            if (/[^\x00-\xff]/g.test(params.keyword))
                lang = 'cn';
            else
                lang = 'en';
            if (params.keyword != '') {
                if (lang == 'cn') {
                    var sql = `select * from list where title like '%${params.keyword}%' order by id desc limit ${params.page * 10}, 10`;
                    var count = `select count(*) as count from list where title like '%${params.keyword}%'`;
                } else {
                    var sql = `select * from list where pinyin like '%${params.keyword}%' order by id desc limit ${params.page * 10}, 10`;
                    var count = `select count(*) as count from list where pinyin like '%${params.keyword}%'`;
                }
                
            } else {
                var sql = `select * from list order by id desc limit ${params.page * 10}, 10`;
                var count = `select count(*) as count from list`;

            }


            console.log(sql);
            var dataTmp = null;
            var queryData = await tempCont.query(`${sql};${count}`, async function (error, rows, fields) {

                console.log('here');
                tempCont.release();



                if (!!error) {
                    console.log("Error in the query");

                    var data = {
                        status: false,
                        msg: 'error',
                        data: error
                    }

                } else {

                    var data = {
                        status: true,
                        msg: 'success',
                        data: rows[0],
                        total: rows[1][0].count
                    }
                    res.json(data);
                    dataTmp = data;
                    return data;

                }
            });

            console.log(queryData, 'queryData');
            console.log(dataTmp, 'dataTmp');
        }
    });




    // res.json({
    //     "status": false
    // });

});


module.exports = router;