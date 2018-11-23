//노드 디펜던시
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//애플리케이션 라우트 설정
var routes = require('./routes/index');
//익스프레스 애플리케이션 생성
var app = express();
//개발용 env변수 프로세스 정의
var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';
//뷰 엔진 EJS
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');

// 파비콘을 사용하라면 아래 주석을 풀것
// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 라우트파일에서 수신할 모든 라우트 설정
app.use('/', routes);

// 404에러
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 에러 스택트레이스 출력
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// 실무에선 스택 ㄴ
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});

module.exports = app;


app.set('port', process.env.PORT || 3000);

//서버 포트 및 사용자 메시지 출력
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});



//Socket.io시작하기
var io = require('socket.io').listen(server);
//사용자 저장할 배열 생성
var userList = [];
//연결 저장할  배열 생성
var connections = [];

//연결시 리스너 설정
io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log("Connected : ",connections.length);
  //사용자 연결 끊기 설정
  socket.on('disconnect',function(data){
    if(socket.username){
      userList.splice(userLust.indexOf(socket.username),1);
    }
    connections.splice(connections.indexOf(socket),1);
    console.log("Disconnected : ",connections.length);
  });

  //새메시지 설정
  socket.on('send message',function(data){
    io.sockets.emit('new message',{msg:data,user:socket.username});
  });

  //새 사용자
  socket.on('new user', function(data, callback){
    callback(!!data);
    socket.username = data;
    userList.push(socket.username);
    updateUsernames();
  });
function updateUsernames(){
  io.sockets.emit('get userList',userList);
}

});
