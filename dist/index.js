'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _uws = require('uws');

var _uws2 = _interopRequireDefault(_uws);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = 8080;
var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

app.use((0, _morgan2.default)('dev'));

app.use((0, _cors2.default)({
  exposedHeaders: '*'
}));

app.use(_bodyParser2.default.json({
  limit: '50mb'
}));

app.wss = new _uws.Server({
  server: app.server
});

//Many clients
var clients = [];

app.wss.on('connection', function (connection) {

  var userId = clients.length + 1;
  connection.userId = userId;

  var newClient = {
    ws: connection,
    userId: userId
  };

  clients.push(newClient);

  console.log('New client connected with userId:', userId);

  connection.on('message', function (message) {

    console.log('message from: ', message);
  });

  connection.on('close', function () {
    console.log('client with Id', userId, 'is disconnected');

    clients = clients.filter(function (client) {
      return client.userId !== userId;
    });
  });
});

app.get('/', function (req, res) {
  res.json({
    version: version
  });
});

app.get('/api/all_connections', function (req, res, next) {
  return res.json({
    people: clients
  });
});

setInterval(function () {

  console.log('there are ' + clients.length + ' people in the connection');

  if (clients.length > 0) {

    clients.forEach(function (client) {

      // console.log('client Id', client.userId)

      var msg = 'Hey Id ' + client.userId + ': you got a new message from the sever';

      client.ws.send(msg);
    });
  }
  //executed every 3 seconds
}, 3000);

app.server.listen(process.env.PORT || PORT, function () {
  console.log('App is running on port ' + app.server.address().port);
});

exports.default = app;
//# sourceMappingURL=index.js.map