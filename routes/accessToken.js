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

            var params = url.parse(req.url, true).query;




            var sql = `select * from user where phone = ${params.phone} limit 0, 10`;


            var dataTmp = null;
            var queryData = await tempCont.query(`${sql}`, async function (error, rows, fields) {

                console.log('here');
                tempCont.release();



                if (!!error) {
                    console.log("Error in the query");

                    var data = {
                        status: false,
                        msg: 'error'
                    }

                    res.json(data);

                } else {

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

        }
    });




    // res.json({
    //     "status": false
    // });

});


module.exports = router;