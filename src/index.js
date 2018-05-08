import http from 'http'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import WebSocketServer, {Server} from 'uws'

const PORT = 8080;
const app = express()
app.server = http.createServer(app)

app.use(morgan('dev'))

app.use(cors({
  exposedHeaders: '*'
}))

app.use(bodyParser.json({
    limit: '50mb'
}))


app.wss = new Server({
  server: app.server
})

//Many clients
let clients = [];


app.wss.on('connection', (connection) => {

  const userId = clients.length + 1
  connection.userId = userId

  const newClient = {
    ws: connection,
    userId: userId,
  }

  clients.push(newClient)

  console.log('New client connected with userId:', userId);


  connection.on('message', (message) => {

    console.log('message from: ', message)

  })

  connection.on('close', () => {
    console.log('client with Id', userId, 'is disconnected');

      clients = clients.filter((client) => client.userId !== userId)
  })
})

app.get('/',(req, res) => {
  res.json({
    version: version
  })
})

app.get('/api/all_connections', (req, res, next) => {
  return res.json({
    people: clients
  })
})


setInterval(() => {

  console.log(`there are ${clients.length} people in the connection`)

  if(clients.length > 0){

      clients.forEach((client) => {

        // console.log('client Id', client.userId)

        const msg = `Hey Id ${client.userId}: you got a new message from the sever`

        client.ws.send(msg)

      })
  }
  //executed every 3 seconds
}, 3000)

app.server.listen(process.env.PORT || PORT, () => {
    console.log(`App is running on port ${app.server.address().port}`)
})

export default app
