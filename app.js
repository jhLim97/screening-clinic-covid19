// express 서버를 위한 모듈
var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var cors = require('cors');

var expressErroHandler = require('express-error-handler');

var config = require('./config/config');

var database_loader = require('./database/database_loader');
var route_loader = require('./router/route_loader');
var clinic = require('./router/clinic');

// 서버 객체
var app = express(); 

// 뷰 관련 설정
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// port 번호 설정
app.set('port', process.env.PORT || config.server_port);

// get 방식
app.use('/public', static(path.join(__dirname, 'public')));

// post 방식
app.use(bodyParser.urlencoded({extended:false})); 
app.use(bodyParser.json()); 

// 세션 추가(GPS를 통해 사용자 정보를 가져온 후 세션에 추가해서 근처 병원 찾기)
app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

app.use(cors());

var router = express.Router();
route_loader.init(app, router);

// 등록된 라우터 패스가 없는 경우
var errorHandler = expressErroHandler({
    static: {
        '404': './public/404.html'
    }
});


app.use(expressErroHandler.httpError(404));
app.use(errorHandler);

var server = http.createServer(app).listen(app.get('port'), function() {    
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
    
    database_loader.init(app, config);
    //clinic.totalNum(database_loader); -> 오전 07시에 업데이트 한 번만 수행
});