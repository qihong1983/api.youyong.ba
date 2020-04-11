var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var userProfileList = require('./routes/userprofile/list');
var userKpireportList = require('./routes/kpireport/list');

var openData = require('./routes/openData/data');
var token = require('./routes/token');

//插入 uuid
var installUuid = require('./routes/installUuid');

//更新 updateUuid
var updateUuid = require('./routes/updateUuid');

//查询 queryUuid 
var queryUuid = require('./routes/queryUuid');


var cname = require('./routes/cname');

//文字转语音

var textToAudio = require('./routes/textToAudio/textToAudio');


//获取结伴列表
var list = require('./routes/list');

//插入活动列表
var insert = require('./routes/insert');

//上传图片
var uploadimg = require('./routes/uploadimg/uploadimg');

//搜索
var searchBar = require('./routes/searchBar/searchBar');


var accessToken = require('./routes/accessToken');

//获取动态密码(短信验证码)
var getPassword = require('./routes/getPassword/getPassword');


//保存用户信息
var saveUserInfo = require('./routes/saveUserInfo/saveUserInfo');


//获取报名列表
var getBaomingList = require('./routes/getBaomingList/getBaomingList');

var okbaoming = require('./routes/okbaoming/okbaoming');


var wxLogin = require('./routes/wxLogin/wxLogin');
var wxLogin2 = require('./routes/wxLogin/wxLogin2');


var wxBaoming = require('./routes/wxBaoming/wxBaoming');
var wxSend = require('./routes/wxSend/wxSend');


var getui = require('./routes/getui/getui');

let jwt = require('jsonwebtoken');
var JWT_PASSWORD = 'token';



var cors = require('cors');

var app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/user_profile_list', userProfileList);
app.use('/user_kpireport_list', userKpireportList);
app.use('/user_profile_list_open', openData);
app.use('/token', token);
app.use('/installUuid', installUuid);

app.use('/updateUuid', updateUuid);

app.use('/queryUuid', queryUuid);

app.use('/textToAudio', textToAudio);




app.use('/cname', cname);



// 游永吧
app.use('/list', list);
app.use('/insert', insert);
app.use('/uploadimg', uploadimg);

app.use('/searchbar', searchBar);
app.use('/accessToken', accessToken);

app.use('/getpassword', getPassword);

app.use('/saveUserInfo', saveUserInfo);

app.use('/getBaomingList', getBaomingList);

app.use('/okbaoming', okbaoming);
// var wxLogin = require('./routes/wxLogin/wxLogin');

app.use('/wxLogin', wxLogin);
app.use('/wxLogin2', wxLogin2);

app.use('/wxBaoming', wxBaoming);

app.use('/wxSend', wxSend);



app.use('/getui', getui);
// getui





// catch 404 and forward to error handler
app.use(function (req, res, next) {

  console.log(req, res, next);
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;