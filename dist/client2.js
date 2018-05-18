'use strict';

var WebSocket = require('uws');

var ws = new WebSocket('ws://localhost:8080');

ws.on('open', function () {
    console.log('successful connected client 2 to server');

    // send new message from client to Server
    ws.send('hello server my name is client 2');

    ws.on('message', function (message) {
        console.log(message);
    });
});
//# sourceMappingURL=client2.js.map