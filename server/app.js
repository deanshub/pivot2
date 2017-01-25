const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const request = require('request')
const CsvStream = require('csv-stream')
const server = require('http').Server(app)
const io = require('socket.io')(server)


function cencelStream(client) {
  client.cancelRequest = true
}

const options = {
  delimiter : ',', // default is ,
  endLine : '\n', // default is \n,
  escapeChar : '"', // default is an empty string
  enclosedChar : '"', // default is an empty string
}

io.on('connection', function(client){
  console.log('connection')
  client.on('streamRequest', function(data) {
    let csvStream = CsvStream.createStream(options)

    let jaql = data.jaql
    let token = data.token
    let baseUrl = data.baseUrl
    let datasource = data.datasource

    client.cancelRequest = false

    request.post(`${baseUrl}/api/datasources/${datasource}/jaql/csv`, {
      form: jaql,
      headers: {
        'Authorization': token,
      },
    })
    .pipe(csvStream)
      .on('error', function(err) {
        console.error(err)
      })
      .on('data', function(data) {
        if (!client.cancelRequest) {
          // outputs an object containing a set of key/value pair representing a line found in the csv file.
          // TODO: change csvStream to create the array automatically
          const row = Object.keys(data).map(header=>data[header])
          client.emit('streamChunk', {row})
        }

      })
      .on('end', function() {
        client.emit('streamChunk', {
          end: true,
        })
      })
  })

  client.on('cancelStream', ()=>cencelStream(client))

  client.on('disconnect', function() {
    console.log('disconnected')
    cencelStream(client)
  })
})

// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post('/jaqlRunner', function (req, res) {
  const jaql = req.body.jaql
  const token = req.body.token
  const baseUrl = req.body.baseUrl
  const datasource = req.body.datasource

  jaql.format = undefined

  request.post(`${baseUrl}/api/datasources/${datasource}/jaql`,{
    form: JSON.stringify(jaql),
    headers: {
      'Authorization': token,
      'content-type': 'application/json',
    },
  }, function(error, response, body) {
    if (error) {
      return res.status(500).send(error)
    }
    return res.status(200).json(JSON.parse(body))
  })
})


app.post('/jaqlStream', function (req, res) {
  // let jaql = req.body.jaql
  // let token = req.body.token
  // let baseUrl = req.body.baseUrl
  // let datasource = req.body.datasource
  //
  // request.post(`${baseUrl}/api/datasources/${datasource}/jaql/csv`,{
  //   form: jaql,
  //   headers: {
  //     'Authorization': token,
  //   },
  // }).pipe(csvStream)
  //   .on('error',function(err){
  //       console.error(err)
  //   })
  //   .on('data',function(data){
  //       // outputs an object containing a set of key/value pair representing a line found in the csv file.
  //       console.log('newData\n', data)
  //   })
  //
  // return res.status(200)
})

app.use(express.static(path.join(__dirname, 'static')))
server.listen(9999, function () {
  console.log('Server port 9999')
})
