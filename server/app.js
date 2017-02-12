const express = require('express')
const path = require('path')
const Rx = require('rxjs/Rx')
const bodyParser = require('body-parser')
const app = express()
const request = require('request')
const CsvStream = require('csv-stream')
const hash = require('object-hash')
const server = require('http').Server(app)
const io = require('socket.io')(server)

let pivotMetaData = {}


function cancelStream(client) {
  client.cancelRequest = true
}

function compareArrays(array1, array2) {
  return (array1.length == array2.length) && array1.every((element, index) => {
    return element === array2[index]
  })
}

function runQueryRowsGroups(data) {
  const { jaql, datasource, baseUrl, token } = data

  const rowsJaqlMetaData = getSpecificPanelFromJaql(jaql, 'rows').map((currMeta) => {
    return currMeta.jaql
  })

  const colsJaqlMetaData = getSpecificPanelFromJaql(jaql, 'columns').map((currMeta) => {
    return currMeta.jaql
  })
  const jaqlFormula = colsJaqlMetaData.reduce(generateJaqlContextAndFormula, {
    formula: '',
    context: {},
  })

  const jaqlRowsGroupCount = {
    datasource: jaql.datasource,
    metadata: rowsJaqlMetaData.concat([jaqlFormula]),
  }

  return new Promise((resolve, reject) => {
    request.post(`${baseUrl}/api/datasources/${datasource}/jaql`, {
      json: jaqlRowsGroupCount,
      headers: {
        'Authorization': token,
      },
    }, function(error, response, body) {
      if (error) {
        reject(error)
      }

      resolve(body.values)
    })
  })
}

function generateJaqlContextAndFormula(res, curr, index, orig) {
  const name = `[${curr.table}.${curr.column}]`

  res.context[name] = curr
  if (index === orig.length - 1) {
    res.formula = `${res.formula.slice(0,res.formula.lastIndexOf(',') + 1)}Count(${name})${res.formula.slice(res.formula.lastIndexOf(',') + 1)}`
  } else {
    res.formula = `${res.formula.slice(0,res.formula.lastIndexOf(',') + 1)}Sum(${name},)${res.formula.slice(res.formula.lastIndexOf(',') + 1)}`
  }

  return res
}

function getTotalRowsNumber(jaqlQueryData, rowsGroups) {
  const lastRowIndex = getLastRowIndexFromJaql(jaqlQueryData)

  const totalRowsNumber = rowsGroups.reduce((res, curr, index, orig) => {
    if (index === 0 || orig[index - 1][lastRowIndex] !== curr[lastRowIndex]) {
      return res + 1
    }

    return res
  }, 0)

  return totalRowsNumber
}

function getLastRowIndexFromJaql(jaqlQueryData) {
  const rowsMetaData = getSpecificPanelFromJaql(jaqlQueryData, 'rows')

  let lastRowIndex = 0

  rowsMetaData.forEach((currRowMeta) => {
    if (currRowMeta.field && currRowMeta.field.index > lastRowIndex) {
      lastRowIndex = currRowMeta.field.index
    }
  })

  return lastRowIndex
}

function getSpecificPanelFromJaql(jaqlQueryData, wantedPanel) {
  return jaqlQueryData.metadata.filter((currMeta) => {
    return currMeta.panel === wantedPanel
  })
}

function getPivotRowsGroups(jaqlHash, jaqlQueryData) {
  return new Promise((resolve) => {
    if (pivotMetaData[jaqlHash] === undefined) {
      return runQueryRowsGroups(jaqlQueryData).then((rowsGroups) => {
        const totalRowsNumber = getTotalRowsNumber(jaqlQueryData.jaql, rowsGroups)
        pivotMetaData[jaqlHash] = {
          rowsGroups,
          totalRowsNumber,
        }

        return resolve(pivotMetaData[jaqlHash])
      })
    } else {
      return resolve(pivotMetaData[jaqlHash])
    }
  })
}

/**
  * Converts a flowing stream to an Observable sequence.
  * @param {Stream} stream A stream to convert to a observable sequence.
  * @param {String} [finishEventName] Event that notifies about closed stream. ("end" by default)
  * @param {String} [dataEventName] Event that notifies about incoming data. ("data" by default)
  * @returns {Observable} An observable sequence which fires on each 'data' event as well as handling 'error' and finish events like `end` or `finish`.
  */
function fromStream(stream, finishEventName, dataEventName) {
  stream.pause()

  finishEventName = finishEventName || 'end'
  dataEventName = dataEventName || 'data'

  return Rx.Observable.create(function (observer) {
    function dataHandler (data) {
      observer.next(data)
    }

    function errorHandler (err) {
      observer.error(err)
    }

    function endHandler () {
      observer.complete()
    }

    stream.addListener(dataEventName, dataHandler)
    stream.addListener('error', errorHandler)
    stream.addListener(finishEventName, endHandler)

    stream.resume()

    return function () {
      stream.removeListener(dataEventName, dataHandler)
      stream.removeListener('error', errorHandler)
      stream.removeListener(finishEventName, endHandler)
    }
  }).share()
}

function getJaqlHash(jaql) {
  const jaqlToHash = {
    datasource: jaql.datasource,
    metadata: getSpecificPanelFromJaql(jaql, 'rows'),
  }

  return hash(jaqlToHash)
}

function calcNewOffsetByRows(offset, rowsGroups) {
  let newOffset = 0

  for (let rowGroupIndex = 0; rowGroupIndex < offset; rowGroupIndex++) {
    newOffset = newOffset + rowsGroups[rowGroupIndex][rowsGroups[rowGroupIndex].length -1].data
  }

  return newOffset
}

function calcNewCountByRows(count, offset, rowsGroups) {
  let newCount = 0

  for (let rowGroupIndex = 0; rowGroupIndex < count; rowGroupIndex++) {
    newCount = newCount + rowsGroups[offset + rowGroupIndex][rowsGroups[offset + rowGroupIndex].length -1].data
  }

  return newCount
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
    const jaqlJson = JSON.parse(decodeURIComponent(decodeURIComponent(jaql.slice(5))))

    const hierarchy = jaqlJson.metadata.reduce((res, curr)=>{
      if (curr && curr.field){
        res[curr.field.index] =
        Object.assign({}, curr.field,
          {name:curr.jaql.title, type:curr.panel}
        )
      }

      return res
    },[])

    const rowsHierarchy = hierarchy.filter((curr)=> {
      return curr.type === 'rows'
    })

    const jaqlHash = getJaqlHash(jaqlJson)

    getPivotRowsGroups(jaqlHash, {jaql:jaqlJson,token,baseUrl,datasource}).then((pivotMetaData)=>{
      client.emit('totalRowsNumber', pivotMetaData.totalRowsNumber)
      const newOffset = calcNewOffsetByRows(jaqlJson.offset, pivotMetaData.rowsGroups)
      const newCount = calcNewCountByRows(jaqlJson.count, jaqlJson.offset, pivotMetaData.rowsGroups)

      jaqlJson.offset = newOffset
      jaqlJson.count = newCount

      client.cancelRequest = false


      const jaqlResultStream = fromStream(request.post(`${baseUrl}/api/datasources/${datasource}/jaql/csv`, {
        // form: jaql,
        form: `data=${encodeURIComponent(encodeURIComponent(JSON.stringify(jaqlJson)))}`,
        headers: {
          'Authorization': token,
        },
      }).pipe(csvStream))


      jaqlResultStream.map((data) => {
        // outputs an object containing a set of key/value pair representing a line found in the csv file.
        // TODO: change csvStream to create the array automatically
        const row = Object.keys(data).map(header=>data[header])

        // let currRowValues = []
        //
        // rowsHierarchy.forEach((currRow) => {
        //   currRowValues.push(row[currRow.index])
        // })
        //
        // const sameRow = compareArrays(currRowValues, lastRowValues)
        //
        // if (!sameRow) {
        //   lastRowValues = currRowValues
        //   rowCounter++
        // }

        return row
      }).subscribe((row) => {
        client.emit('streamChunk', {row})
      })
    })

    // let lastRowValues = []
    // let rowCounter = 0

  })

  client.on('cancelStream', ()=>cancelStream(client))

  client.on('disconnect', function() {
    console.log('disconnected')
    cancelStream(client)
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
