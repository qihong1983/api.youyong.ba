var express = require('express');
var router = express.Router();

var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

let jwt = require('jsonwebtoken');
var JWT_PASSWORD = 'token';


var mysql = require('mysql');


const Mock = require('mockjs');

var multer = require('multer');

var url = require('url');

var fs = require('fs');


var path = require('path');

var upload = multer({ dest: 'upload_tmp/' });

router.post('/', upload.any(), function (req, res, next) {
    console.log(req, 'reqreq');
    console.log(req.avatar, '上传的文件');  // 上传的文件信息
    console.log(req.files[0], '***');
    console.log(req.filename, '***');

    console.log(req.files[0].path, 'req.files[0].path')
    // console.log(req.filename[0], '***');

    var des_file = "../upload/" + req.files[0].originalname;

    des_file = path.join(__dirname, '../../public/uploadimg/' + req.files[0].originalname);

    console.log(path.resolve(des_file));

    fs.readFile(req.files[0].path, function (err, data) {
        console.log(data, '####');

        fs.writeFile(des_file, data, function (err) {


            console.log(err, 'errerr');

            console.log(des_file, 'des_file');


            if (err) {
                res.json({
                    status: false,
                    msg: err
                })
            } else {
                response = {
                    message: 'File uploaded successfully',
                    filename: req.files[0].originalname
                };
                console.log(response);
                // res.end(JSON.stringify(response));
                res.json({
                    status: true,
                    msg: 'success',
                    data: `http://localhost:8081/uploadimg/${req.files[0].originalname}`
                });
            }
        });
        // res.json({
        //     status: true,
        //     msg: 'success'
        // });
    });
});


module.exports = router;