'use strict';

var GeTui = require('gt-push-sdk/GT.push');
var Target = require('gt-push-sdk/getui/Target');

var APNTemplate = require('gt-push-sdk/getui/template/APNTemplate');
var BaseTemplate = require('gt-push-sdk/getui/template/BaseTemplate');
var APNPayload = require('gt-push-sdk/payload/APNPayload');
var DictionaryAlertMsg = require('gt-push-sdk/payload/DictionaryAlertMsg');
var SimpleAlertMsg = require('gt-push-sdk/payload/SimpleAlertMsg');
var NotyPopLoadTemplate = require('gt-push-sdk/getui/template/NotyPopLoadTemplate');
var LinkTemplate = require('gt-push-sdk/getui/template/LinkTemplate');
var NotificationTemplate = require('gt-push-sdk/getui/template/NotificationTemplate');
var PopupTransmissionTemplate = require('gt-push-sdk/getui/template/PopupTransmissionTemplate');
var TransmissionTemplate = require('gt-push-sdk/getui/template/TransmissionTemplate');

var SingleMessage = require('gt-push-sdk/getui/message/SingleMessage');
var AppMessage = require('gt-push-sdk/getui/message/AppMessage');
var ListMessage = require('gt-push-sdk/getui/message/ListMessage');
var Notify = require('gt-push-sdk/getui/template/notify/Notify');

var AliMNS = require("ali-mns");





var HOST = 'http://sdk.open.api.igexin.com/apiex.htm';
//消息推送Demo   for apns 通道下发。
//在线走个推通道下发，需要客户端在透传回调处接收到后自己实现通知栏展示
//离线走apns通道下发，消息会直接展示的(1.客户端通知设置打开；2.检查客户端cid与devicetoken是否绑定。)



var APPID = 'iYL8wf8rlJ6UY9dv6rpjq4';
var APPKEY = 'JUqYCqINyhApUuuZgzCZJ3';            
var MASTERSECRET = '3tYtDZY93S7mhfjiaHLUs2';  
var CID = '';
var DEVICETOKEN='';
var alias='';



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
                // res.json(data);
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

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});





router.get('/', bodyParser.json(), function (req, res, next) {


    res.set({ 'Access-Control-Allow-Origin': '*' })

    var gt = new GeTui(HOST, APPKEY, MASTERSECRET);


    var params = url.parse(req.url, true).query;

    console.log(params, 'params');


    var queueName = 'youyongba';

    const account = new AliMNS.Account("1435909372813240", "LTAIML0c4KUngOmA", "gbkS2o8UtIVAhs5TovJFHT3SoE2MVX");
    const mqBatch = new AliMNS.MQBatch(queueName, account, "hangzhou");

 
    var data = {
        "notify": {
          "title": params.title,
          "describe": params.body,
          "url": "https://www.youyong.ba"
        },
        "uuid": "9f4faba0-80c6-11ea-bcdf-b97e681cda17"
      };
    
    mqBatch.sendP(JSON.stringify(data)).then(console.log, console.error);
    
    


    pushMessageToApp();
    
    
    res.status(200).json({
        status: true,
        msg: 'success'
    });


    function pushMessageToApp() {
        // var taskGroupName = 'test';
        var taskGroupName = null;
    
        //消息类型 : 状态栏通知 点击通知启动应用
        // var template = NotificationTemplateDemo();
        var template = TransmissionTemplateDemo();
    
        
    
        //个推信息体
        //基于应用消息体
        var message = new AppMessage({
            isOffline: false,
            offlineExpireTime: 3600 * 12 * 1000,
            data: template,
            appIdList: [APPID]
    //        phoneTypeList: ['IOS'],
    //        provinceList: ['浙江'],
            //tagList: ['阿百川']
    //        speed: 1
        });
    
    
        // gt.getContentId(message, taskGroupName, function (err, res) {
        //     console.log(err, res, 'err, res');
        // });
    
        gt.pushMessageToApp(message, taskGroupName, function (err, res) {
            console.log(err,res, 'resres');
        });
    }
    

    function TransmissionTemplateDemo() {
        var template =  new TransmissionTemplate({
            appId: APPID,
            appKey: APPKEY,
            transmissionType: 2,
            transmissionContent: '离线内容9'
        });
        //APN简单推送
    //     var payload = new APNPayload();
    //     var alertMsg = new SimpleAlertMsg();
    //     // var alertMsg = new DictionaryAlertMsg();
    //     alertMsg.alertMsg={"title": "测试5", "body": "测试测试5"};
    //     // alertMsg.alertMsg={"title": "测试3", "body": "con32tent4"};
    // //        alertMsg.title = "Title1";
    // //    alertMsg.titleLocKey = "TitleLocKey123";
    // //    alertMsg.titleLocArgs = Array("TitleLocArg323");
    //     payload.alertMsg = alertMsg;
    //     payload.badge=5;
    //     payload.contentAvailable =0;
    //     payload.category="";
    //     payload.sound="";
    //     //payload.customMsg.payload1="";
    //     template.setApnInfo(payload);
    
    var num = Mock.mock({
        "number|1-100": 100
      })

        //APN高级推送
        var payload = new APNPayload();
        var alertMsg = new DictionaryAlertMsg();
        alertMsg.body = params.body;
        alertMsg.actionLocKey = "actionLocKey";
        alertMsg.locKey = "locKey";
        alertMsg.locArgs = Array("locArgs");
        alertMsg.launchImage = "AppIcon";
        //ios8.2以上版本支持
        alertMsg.title = params.title;
        alertMsg.titleLocKey = "titleLocKey";
        alertMsg.titleLocArgs = Array("titleLocArgs");
        
        payload.alertMsg=alertMsg;
        payload.badge=num.number;
       payload.contentAvailable =1;
       payload.category="";
       payload.sound="";
       payload.customMsg.payload1="payload";
       template.setApnInfo(payload);
        return template;
    }

    // connection.getConnection(function (error, tempCont) {
    //     if (!!error) {
    //         tempCont.release();
    //     } else {

    //         console.log(req);

    //         var params = url.parse(req.url, true).query;
    //         console.log(params, 'params');

    //         console.log(params.page, 'params.page');





    //         //用户id
    //         params.userId
    //         //发布主是
    //         params.title
    //         //结止报名人数
    //         params.endNum
    //         //图片
    //         params.img
    //         //是否结束
    //         params.isOver
    //         //多少人报名
    //         params.num
    //         //费用
    //         params.price
    //         //发布者
    //         params.sendUser
    //         //游泳开始时间
    //         params.startTime
    //         //发布者图标
    //         params.thumb
    //         //拼音
    //         params.pinyin

    //         console.log(params.userId, '用户id');
    //         console.log(params.title, '发布主题');
    //         console.log(params.endNum, '结束人数');
    //         console.log(params.img, '封面图');


    //         console.log(params.isOver, '是否结束');
    //         console.log(params.num, '报名人数');
    //         console.log(params.price, '报名价钱');
    //         console.log(params.sendUser, '发布者');
    //         console.log(params.startTime, '集合时间');
    //         console.log(params.thumb, '发布者logo');
    //         console.log(params.pinyin, '拼音');

    //         let auth = req.headers.authorization;
    //         if (!auth || !auth.startsWith('Bearer')) {
    //             return res.status(401).json({
    //                 status: false,
    //                 msg: -1
    //             });
    //         } else {
    //             auth = auth.split('Bearer').pop().trim();
    //         }

    //         jwt.verify(auth, JWT_PASSWORD, (err, jwtData) => {
    //             if (err) {
    //                 return res.status(401).json({
    //                     status: false,
    //                     msg: -1
    //                 })
    //             } else {
    //                 sendHuodong(params, tempCont).then(function (msg) {
    //                     console.log(msg, 'msgmsgmsg');
    //                     res.json(msg);
    //                 });

    //             }
    //         });

 
    //     }
    // });




});


module.exports = router;