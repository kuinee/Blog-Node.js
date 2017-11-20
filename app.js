var express = require('express');
var path = require('path');


var session=require('express-session');
var MongoStore=require('connect-mongo')(session);
var settings=require('./settings');

var flash=require('connect-flash');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

//设置端口文process.env.PORT或为3000
app.set('port',process.env.PORT||3000);

// 设置views文件夹为存放视图文件的目录，即存放模板文件的地方
app.set('views', path.join(__dirname, 'views'));

//设置视图模板引擎为ejs
app.set('view engine', 'ejs');

//用于页面通知
app.use(flash());

//使用favicon图标
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//connect内建的中间件，在终端显示简单的日志
app.use(logger('dev'));

//用来解析请求体，支持application/json、application/x-www-form-urlencoded和multipart/form-data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Cookie解析的中间件
app.use(cookieParser());
//提供会话支持
app.use(session({
	secret:settings.cookieSecret,//防止篡改Cookie
	key:settings.db,
	resave:true,
	saveUninitialized:false,
	cookie:{maxAge:1000*60*60*24*30},//30days
	store:new MongoStore({//将会话信息存储在数据库中，持久维护
		db:settings.db,
		host:settings.host,
		port:settings.port,
		url:'mongodb://localhost/blog'
	})
}));

//将根目录下的public文件夹设置为存放image、css、js等静态文件的目录
app.use(express.static(path.join(__dirname, 'public')));


//创建http服务器并监听3000端口
app.listen(app.get('port'),function(){
	console.log('Express server listening on port');
});

routes(app);
module.exports = app;
