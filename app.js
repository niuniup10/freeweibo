
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fetcher = require('./fetcher');
var config = require('./app/config');
var controller = require('./app/controller');
var mail = require('./app/mail');
var log4node = require('log4node');

// change timezone to HongKong(GMT+8)
process.env.TZ = 'Hongkong';

var log = new log4node.Log4Node({level: 'info', file: path.normalize(__dirname + '/logs/run.log')});

config.log = log;

process.on('uncaughtException', function (e) {
  log.error(e.stack);
  sendmail({
    address: 'tristones.liu@gmail.com', 
    sub: 'Exception On Exit at ' + (new Date()).toLocaleString('en-US'),
    text: '>>> ' + e.stack
    });
});


process.on('exit', function () {
  log.info('process exiting...');
});

// first, boot fetcher
var service = fetcher(controller.db, config);

controller.initService(service);
// then, mailer
var sendmail = mail(controller.db, config);

var app = express();

// all environments
app.set('port', 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('*hd&hdo*(Qhdsajk'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/about', controller.about);
app.get('/cancel', controller.unsubscribe);
app.get('/admin', controller.admin);
app.get('/login', controller.login);
app.get('/', controller.index);

app.post('/author', controller.author);
app.post('/email', controller.email);
app.post('/add-user', controller.adminUsers);
app.post('/delete-user', controller.adminUsers);

http.createServer(app).listen(app.get('port'), function(){
  log.info('Express server listening on port ' + app.get('port'));
});
