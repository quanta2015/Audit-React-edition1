#!/usr/bin/env node
const http = require('http');
const https = require('https')
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors')
const compression = require('compression')
const bodyParser = require('body-parser')
const createError = require('http-errors')


const router = require('./router/index')

const app = express()
const port = 8080

app.use(compression())
app.use(cors())
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'jade');



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(__dirname + '/'));

app.use('/', router);


// 错误处理
app.use(function(req, res, next) {
  next(createError(404));
});

// 错误处理
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});


var server  = http.createServer(app).listen(port)

server.on('error', onError)
server.on('listening', onListening)



function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}




