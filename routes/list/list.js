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

    connection.getConnection(function (error, tempCont) {
        if (!!error) {
            tempCont.release();
        } else {

            console.log(req);

            var params = url.parse(req.url, true).query;
            console.log(params, 'params');

            console.log(params.page, 'params.page');

            var sql = `select * from list limit ${params.page}, 8`;

            console.log(sql);

            tempCont.query(sql, function (error, rows, fields) {

                console.log('here');
                tempCont.release();



                if (!!error) {
                    console.log("Error in the query");
                } else {

                    var data = {
                        status: true,
                        msg: 'success',
                        data: rows
                    }
                    res.json(data);
                }
            });
        }
    });




    // res.json({
    //     "status": false
    // });

});


module.exports = router;