var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var app = express()
var request = require('request')

// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post('/jaqlRunner', function (req, res) {
  let jaql = req.body.jaql
  let token = req.body.token
  let baseUrl = req.body.baseUrl
  let datasource = req.body.datasource

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

app.use(express.static(path.join(__dirname, 'static')))

app.listen(9999, function () {
  console.log('Server port 9999')
})
