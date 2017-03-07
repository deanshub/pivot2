const express = require('express')
const path = require('path')
const Rx = require('rxjs/Rx')
const bodyParser = require('body-parser')
const app = express()
const request = require('request')
const CsvStream = require('csv-stream')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const rxEnhancements = require('./utils/rxEnhancements.js')
const jaqlUtils = require('./utils/jaqlUtils.js')

Rx.Observable.prototype.groupToPivotRow = rxEnhancements.groupToPivotRow

function cancelStream(client) {
  client.cancelRequest = true
}

const options = {
  delimiter : ',', // default is ,
  endLine : '\n', // default is \n,
  escapeChar : '"', // default is an empty string
  enclosedChar : '"', // default is an empty string
}

io.on('connection', function(client){
  client.pivotsCache = {}

  console.log('connection')

  client.on('streamRequest', function(data) {
    let csvStream = CsvStream.createStream(options)

    let jaql = data.jaql
    let token = data.token
    let baseUrl = data.baseUrl
    let datasource = data.datasource
    const jaqlJson = JSON.parse(decodeURIComponent(decodeURIComponent(jaql.slice(5))))

    const lastRowIndex = jaqlUtils.getLastRowIndexFromJaql(jaqlJson)

    const jaqlHash = jaqlUtils.getJaqlHash(jaqlJson)
    if (!client.pivotsCache[jaqlHash]) {
      client.pivotsCache[jaqlHash] = {}
    }

    if (!client.pivotsCache[jaqlHash].rawData) {
      client.pivotsCache[jaqlHash].rawData = []
    }

    if (!client.pivotsCache[jaqlHash].dataDictionary) {
      client.pivotsCache[jaqlHash].dataDictionary = []
    }

    const pageSize = jaqlJson.count
    const wantedOffset = jaqlJson.offset

    jaqlJson.offset = undefined
    jaqlJson.count = undefined

    client.cancelRequest = false

    if (!client.pivotsCache[jaqlHash].streamObserver) {
      const jaqlResultStream = rxEnhancements.fromStream(request.post(`${baseUrl}/api/datasources/${datasource}/jaql/csv`, {
        // form: jaql,
        form: `data=${encodeURIComponent(encodeURIComponent(JSON.stringify(jaqlJson)))}`,
        headers: {
          'Authorization': token,
        },
      }).pipe(csvStream))

      client.pivotsCache[jaqlHash].currRowIndex = 0
      client.pivotsCache[jaqlHash].numOfRowsCached = -1
      client.pivotsCache[jaqlHash].lastRow = []

      client.pivotsCache[jaqlHash].streamObserver = jaqlResultStream.map((data) => {
        // outputs an object containing a set of key/value pair representing a line found in the csv file.
        // TODO: change csvStream to create the array automatically
        const row = Object.keys(data).map(header=>data[header])

        return row
      }).do((data)=> {
        client.pivotsCache[jaqlHash].rawData.push(data)
      }).groupToPivotRow(lastRowIndex)
      .filter((pivotRow) => {
        return pivotRow && pivotRow.length
      })
      .do((pivotRow) => {
        client.pivotsCache[jaqlHash].dataDictionary.push({
          start: client.pivotsCache[jaqlHash].currRowIndex,
          end: client.pivotsCache[jaqlHash].currRowIndex + pivotRow.length - 1,
        })

        client.pivotsCache[jaqlHash].currRowIndex += pivotRow.length

        client.pivotsCache[jaqlHash].numOfRowsCached += 1
      }).share()
    }

    if (client.pivotsCache[jaqlHash].dataDictionary[wantedOffset] &&
        client.pivotsCache[jaqlHash].dataDictionary[wantedOffset + pageSize]) {
      client.emit('totalPagesCached', Math.ceil(client.pivotsCache[jaqlHash].dataDictionary.length / pageSize))

      let rawDataOffset = client.pivotsCache[jaqlHash].dataDictionary[wantedOffset].start


      for (let pivotRowIndex = 0; pivotRowIndex < pageSize; pivotRowIndex++) {
        const pivotOffset = wantedOffset + pivotRowIndex

        const pivotRowDataChunksCount =
          (client.pivotsCache[jaqlHash].dataDictionary[pivotOffset].end - client.pivotsCache[jaqlHash].dataDictionary[pivotOffset].start) + 1

        let currPivotRow = []

        for (let dataChunksIndex = 0; dataChunksIndex < pivotRowDataChunksCount; dataChunksIndex++) {
          currPivotRow.push(client.pivotsCache[jaqlHash].rawData[rawDataOffset])
        }

        client.emit('streamChunk', currPivotRow)

        rawDataOffset = rawDataOffset + pivotRowDataChunksCount
      }


    } else {
      client.pivotsCache[jaqlHash].streamObserver
      .filter(() => {
        return client.pivotsCache[jaqlHash].numOfRowsCached % pageSize === 0
      }).map(() => {
        return Math.floor(client.pivotsCache[jaqlHash].numOfRowsCached / pageSize)
      })
      .subscribe((totalPagesCached) => {
        if (totalPagesCached % 1000 === 0) {
          client.emit('totalPagesCached', totalPagesCached)
        }
      }, (err) => {
        console.log(err)
      }, () => {
        client.emit('totalPagesCached', Math.ceil(client.pivotsCache[jaqlHash].numOfRowsCached / pageSize))
      })

      client.pivotsCache[jaqlHash].streamObserver
      .filter(() => {
        return (client.pivotsCache[jaqlHash].numOfRowsCached >= wantedOffset &&
          client.pivotsCache[jaqlHash].numOfRowsCached < wantedOffset + pageSize)
      })
      .subscribe((pivotRow) => {
        // setTimeout(()=>{
        client.emit('streamChunk', pivotRow)
        // }, 0)
      }, (err) => {
        console.log(err)
      }, () => {
        // client.emit('totalPagesCached', Math.ceil(pivotsCache[jaqlHash].numOfRowsCached / pageSize))
      })
    }
  })

  client.on('cancelStream'  , ()=> cancelStream(client))

  client.on('disconnect', function() {
    console.log('disconnected')
    cancelStream(client)
  })
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'static')))
server.listen(9999, function () {
  console.log('Server port 9999')
})
