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



const connnectDb = () => {
    return new Promise(async function (resolve, reject) {

        var connection = mysql.createPool({
            host: '39.106.140.80',
            user: 'root',
            password: 'Qihong38752673',
            database: 'youyongba',
            multipleStatements: true
        });
        
        connection.getConnection(async function (error, tempCont) {

            console.log('#######');
            if (!!error) {
                tempCont.release();
            }  else {
                resolve(tempCont);
            }
        });
    });
}



const insertSend = (data, tempCont) => {    
    return new Promise((resolve, reject)=> {
        
        // var sql = `INSERT INTO baoming (id,userid, classId, avatar, user) VALUES (NULL, "${data.userId}","${data.classId}", "${data.avatar}", "${data.userName}")`;


        var sql = `INSERT INTO youyongba.list (id, userId, endNum, img, isOver, num, price, sendUser, startTime, thumb, title, pinyin) VALUES (NULL, ${data.userId}, '${data.endNum}', '${data.img}', ${data.isOver}, ${data.num}, '${data.price}', '${data.sendUser}', '${data.startTime}', '${data.thumb}', '${data.title}', '${data.pinyin}');`;


        

        console.log(sql, 'sql');
        console.log('看看这里执行了吗');

        tempCont.query(sql, function (error, rows, fields) {


            console.log(error, rows, fields, '看看执行成功没');
            console.log('here');
            tempCont.release();

            var data = {};
            if (!!error) {
                
                console.log('执行失败');
                data = {
                    status: false,
                    msg: 'error'
                }
                // res.json(data);
            } else {

                console.log('执行成功');
                data = {
                    status: true,
                    msg: 'success'
                }
                resolve(data);
            }
        });

        
    });
}



router.get('/', bodyParser.json(), async function (req, res, next) {

    console.log('aaaa');
    var tempCont = await connnectDb();


    var isSend = await insertSend(req.query, tempCont);

    res.json(isSend);

    console.log(isSend, '看看这个是什么东东');
    
    console.log('bbbb');



});





module.exports = router;