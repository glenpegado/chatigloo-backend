const WebSocket = require('uws')

const ws = new WebSocket('ws://localhost:8080')

ws.on('open', () => {

  console.log('successful connected client 1 to server');
  // send new message from client to Server
  ws.send('hello server my name is client 1')

  //listen message

  ws.on('message', (message) => {
      console.log(message);
  })
})
