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


const sendHuodong = (params, tempCont) => {

    return new Promise(async function (resolve, reject) {
        var sql = `INSERT INTO youyongba.list (id, userId, endNum, img, isOver, num, price, sendUser, startTime, thumb, title, pinyin) VALUES (NULL, ${params.userId}, '${params.endNum}', '${params.img}', ${params.isOver}, ${params.num}, '${params.price}', '${params.sendUser}', '${params.startTime}', '${params.thumb}', '${params.title}', '${params.pinyin}');`;

        console.log(sql);

        tempCont.query(sql, function (error, rows, fields) {

            console.log('here');
            tempCont.release();

            var data = {};
            if (!!error) {

                data = {
                    status: false,
                    msg: 'error'
                }
                res.json(data);
            } else {
                data = {
                    status: true,
                    msg: 'success'
                }
                resolve(data);
            }
        });
    });
}

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get('/', bodyParser.json(), function (req, res, next) {



    connection.getConnection(function (error, tempCont) {
        if (!!error) {
            tempCont.release();
        } else {

            console.log(req);

            var params = url.parse(req.url, true).query;
            console.log(params, 'params');

            console.log(params.page, 'params.page');





            //用户id
            params.userId
            //发布主是
            params.title
            //结止报名人数
            params.endNum
            //图片
            params.img
            //是否结束
            params.isOver
            //多少人报名
            params.num
            //费用
            params.price
            //发布者
            params.sendUser
            //游泳开始时间
            params.startTime
            //发布者图标
            params.thumb
            //拼音
            params.pinyin

            console.log(params.userId, '用户id');
            console.log(params.title, '发布主题');
            console.log(params.endNum, '结束人数');
            console.log(params.img, '封面图');


            console.log(params.isOver, '是否结束');
            console.log(params.num, '报名人数');
            console.log(params.price, '报名价钱');
            console.log(params.sendUser, '发布者');
            console.log(params.startTime, '集合时间');
            console.log(params.thumb, '发布者logo');
            console.log(params.pinyin, '拼音');

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
                    sendHuodong(params, tempCont).then(function (msg) {
                        console.log(msg, 'msgmsgmsg');
                        res.json(msg);
                    });

                }
            });

            // var sql = `INSERT INTO youyongba.list (id, userId, endNum, img, isOver, num, price, sendUser, startTime, thumb, title, pinyin) VALUES (NULL, ${params.userId}, '${params.endNum}', '${params.img}', ${params.isOver}, ${params.num}, '${params.price}', '${params.sendUser}', '${params.startTime}', '${params.thumb}', '${params.title}', '${params.pinyin}');`;

            // console.log(sql);

            // tempCont.query(sql, function (error, rows, fields) {

            //     console.log('here');
            //     tempCont.release();

            //     if (!!error) {

            //         var data = {
            //             status: false,
            //             msg: 'error'
            //         }
            //         res.json(data);
            //     } else {
            //         var data = {
            //             status: true,
            //             msg: 'success'
            //         }
            //         res.json(data);
            //     }
            // });
        }
    });




    // res.json({
    //     "status": false
    // });

});


module.exports = router;