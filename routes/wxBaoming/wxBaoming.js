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




const queryBaoming = () => {
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



const checkQuery = (data, tempCont) => {
    return new Promise(async function (resolve, reject) {
        

        console.log(data, 'data参数');

        var querySql = `select id,userid,avatar,user from baoming where classId = ${data.classId} and  avatar= '${data.avatar}' and user= '${data.user}'`;
    
            console.log(querySql, 'querySql');
      
            tempCont.query(`${querySql}`, async function (error, rows, fields) {
                if (!!error) {
                    tempCont.release();
        
                } else {
                    console.log(rows, '****rowsrows****');
                    
                    resolve(rows);
                }
            });

    
       


    });
}


const insertSql = (data, tempCont) => {
    return new Promise(async function (resolve, reject) {
        console.log(data);

        var sql = `INSERT INTO baoming (id, classId, avatar, user) VALUES (NULL,"${data.classId}", "${data.avatar}", "${data.user}")`;

        tempCont.query(`${sql}`, async function (error, rows, fields) {
            if (!!error) {
                // tempCont.release();
                
                resolve(false);
            } else {
                console.log(rows,fields,error, '****rowsrowsinsertSql****');
                resolve(true);

                
                // resolve(rows);
            }

        });

    })
}

router.get('/', bodyParser.json(), async function (req, res, next) {

    console.log('^^^^^^^^^^^^^^&&&&&&&&&^^^^^^^^^&&&&&&&');

    var tempCont = await queryBaoming();


    console.log(tempCont, '******');


    var checkQueryVal = await checkQuery(req.query, tempCont);

    console.log(checkQueryVal, 'checkQueryVal');


    if (checkQueryVal.length == 0) {

        var isSuccess = await insertSql(req.query, tempCont);

        if (isSuccess) {
            res.json({
                status: true,
            });
        }
        
        // res.json({
        //     status: true,
        //     data: checkQueryVal
        // });


    } else {
        res.json({
            status: false
        });
    }


});

module.exports = router;