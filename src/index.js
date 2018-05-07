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

  connection.on('close', () => {
    console.log('client disconnected');
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

app.server.listen(process.env.PORT || PORT, () => {
    console.log(`App is running on port ${app.server.address().port}`)
})

export default app
