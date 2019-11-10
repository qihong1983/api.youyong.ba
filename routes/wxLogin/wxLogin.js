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


const saveWxUserInfo = (data, tempCont) => {
    return new Promise(async function (resolve, reject) {

        var querySql = `select unionid from user where unionid = "${data.unionid}"`;


        await tempCont.query(`${querySql}`, async function (error, rows, fields) {
            tempCont.release();



            var returnData = null;
            if (!!error) {
                returnData = {
                    status: false
                }
            } else {

                if (rows.length != 0) {
                    returnData = {
                        status: true,
                        data: data
                    }
                } else {
                    returnData = {
                        status: false,
                        data: data
                    }
                }

            }
            resolve(data);


        });
    })
}



const selectWxUserInfo = (data) => {
    return new Promise(async function (resolve, reject) {

        var querySql = `select id,avatar, username,unionid from user where unionid = ${data.unionid}`;

        // avatar: "https://api.youyong.ba/uploadimg/1113.png"
        // id: 17
        // phone: "18600190151"
        // token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjE4NjAwMTkwMTUxIiwiaWF0IjoxNTczMzk2ODI5LCJleHAiOjE1NzMzOTg2Mjl9.fqHddI9L5VBnEr4mkku_oatYAeiqzH0rcmwr_EeGuxo"
        // username: "1111"

        await tempCont.query(`${querySql}`, async function (error, rows, fields) {
            // tempCont.release();

            var data = null;
            if (!!error) {
                data = {
                    status: false
                }
            } else {
                console.log(rows);
                if (rows.length != 0) {
                    data = {
                        status: true,
                        data: rows[0]
                    }
                } else {
                    data = {
                        status: false,
                        data: data[0]
                    }
                }

            }
            resolve(data);


        });
    })
}


const updateWxUserInfo = (data, tempCont) => {
    return new Promise(async function (resolve, reject) {
        // var updataSql = `UPDATE user SET password = ${randomNum},  WHERE unionid = ${data.unionid}`;

        // await tempCont.query(`${updataSql}`, async function (error, rows, fields) {

        //     // tempCont.release();

        //     if (!!error) {
        //         var data = {
        //             status: false
        //         }
        //     } else {
        //         var data = {
        //             status: true
        //         }
        //         resolve(data);

        //     }


        // })


    })
}


const insertWxUserInfo = (data, tempCont) => {
    return new Promise(async function (resolve, reject) {
        var sql = `INSERT INTO user (id, username, avatar, unionid) VALUES (NULL, "${data.nickname}", "${data.headimgurl}", "${data.unionid}")`;
        console.log(222);


        // openid: 'oarz45uz5JJtr5pF0p004IGIpRnM',
        // nickname: '小洪',
        // sex: 1,
        // language: 'zh_CN',
        // city: 'East',
        // province: 'Beijing',
        // country: 'CN',
        // headimgurl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTISxADAWm95lxDjCe4b9gucNP4LdZ6CbBGicsH48KaRpzzqSdiaHFryKcz5E1W1ibrKf2dFx6BhFD9OQ/132',
        // privilege: [],
        // unionid: 'ovIaC0d8U6GMlCA32qBkPSfLctAw'


        await tempCont.query(`${sql}`, async function (error, rows, fields) {

            console.log(rows, 'rowsrowsrows');

            console.log(333);
            var data = null;
            if (!!error) {
                console.log(error, 'error');

                data = {
                    status: false,
                    data: data
                }
            } else {
                console.log(555);
                data = {
                    status: true,
                    data: data
                }
            }



            resolve(data);

        });
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

                if (msg.status) {

                    // msg.data.access_token
                    //https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID

                    return getUserInfo(msg.data.access_token, msg.data.openid);
                }

            }).then(function (msg) {
                console.log(msg, 'msgsmsgmsgmsgmsgmsgmsgmsg');

                console.log(msg.data.access_token, 'msg.data.access_tokenmsg.data.access_token');


                if (msg.status) {
                    console.log('登录成功');


                    return saveWxUserInfo(msg.data, tempCont);




                    // res.json({
                    //     status: true
                    // })

                } else {
                    console.log('登录失败');
                    res.json({
                        status: false,
                        msg: '登录失败'
                    });
                }


            }).then(function (msg) {
                console.log(msg, "看看有没有数据");
                if (msg.status) {
                    //update

                    // updateWxUserInfo(msg.data, tempCont);

                    // selectWxUserInfo(msg.data, tempCont);

                    //返回数据
                    res.json(msg);
                    // res.json({
                    //     status: true
                    // })
                } else {

                    //insert
                    insertWxUserInfo(msg.data, tempCont);

                    // res.json({
                    //     status: true
                    // })
                }
            }).then(function (msg) {
                console.log(msg, '看看最终返回的是什么');
                if (msg.status) {

                    res.json(msg);

                    // res.json({
                    //     status: true,
                    //     data: {
                    // avatar: "https://api.youyong.ba/uploadimg/1113.png"
                    // id: 17
                    // phone: "18600190151"
                    // token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjE4NjAwMTkwMTUxIiwiaWF0IjoxNTczMzk2ODI5LCJleHAiOjE1NzMzOTg2Mjl9.fqHddI9L5VBnEr4mkku_oatYAeiqzH0rcmwr_EeGuxo"
                    // username: "1111"
                    //     }
                    // })
                }
            });

        }
    })
});

module.exports = router;