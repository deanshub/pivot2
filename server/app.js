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
const cacheUtils = require('./utils/cacheUtils.js')
const sisenseUtils = require('./utils/sisenseUtils.js')

Rx.Observable.prototype.groupToPivotRow = rxEnhancements.groupToPivotRow


const emitEveryXPages = 1000

const options = {
  delimiter : ',', // default is ,
  endLine : '\n', // default is \n,
  escapeChar : '"', // default is an empty string
  enclosedChar : '"', // default is an empty string
}




io.on('connection', function(client) {
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

    const pageSize = jaqlJson.count
    const wantedOffset = jaqlJson.offset

    client.cancelRequest = false

    sisenseUtils.getRevisionId(baseUrl, datasource, token).then((revisionId) => {
      const jaqlHash = jaqlUtils.getJaqlHash(jaqlJson, revisionId)
      const pivotJaql = jaqlUtils.clearJaqlToPivot(jaqlJson)
      const pivotCache = cacheUtils.initCacheForJaql(client, jaqlHash)

      if (!pivotCache.streamObserver) {
        const jaqlResultStream = rxEnhancements.fromStream(request.post(`${baseUrl}/api/datasources/${datasource.id}/jaql/csv`, {
          // form: jaql,
          form: `data=${encodeURIComponent(encodeURIComponent(JSON.stringify(pivotJaql)))}`,
          headers: {
            'Authorization': token,
          },
        }).pipe(csvStream))

        cacheUtils.initCacheForStream(pivotCache)

        pivotCache.streamObserver = jaqlResultStream.map((data) => {
          // outputs an object containing a set of key/value pair representing a line found in the csv file.
          // TODO: change csvStream to create the array automatically
          const row = Object.keys(data).map(header=>data[header])

          return row
        }).do((data)=> {
          cacheUtils.addDataToCache(pivotCache, data)
        }).groupToPivotRow(lastRowIndex)
        .filter((pivotRow) => {
          return pivotRow && pivotRow.length
        })
        .do((pivotRow) => {
          cacheUtils.addPivotRowToDataDictionary(pivotCache, pivotRow)
        }).share()
      }

      // If the wanted page is already cached
      if (cacheUtils.checkIfPageCached(pivotCache, wantedOffset, pageSize)) {
        // Emit total number of pages being cached
        cacheUtils.emitTotalPagesCached(client, pivotCache, pageSize)

        // Emits the cached page to the client
        cacheUtils.emitCachedPage(client, pivotCache, wantedOffset, pageSize)
      } else {
        streamPageNumbers(pivotCache, pageSize, client)

        streamPageData(pivotCache, wantedOffset, pageSize, client)
      }
    })
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

function cancelStream(client) {
  client.cancelRequest = true
}

function streamPageNumbers(pivotCache, pageSize, client) {
  pivotCache.streamObserver
  .filter(() => {
    return cacheUtils.fullPageCached(pivotCache, pageSize)
  }).map(() => {
    return cacheUtils.getCachedPagesNum(pivotCache, pageSize)
  })
  .subscribe(() => {
    cacheUtils.emitTotalPagesCached(client, pivotCache, pageSize, emitEveryXPages)
  }, (err) => {
    console.log(err)
  }, () => {
    cacheUtils.emitTotalPagesCached(client, pivotCache, pageSize)
  })
}

function streamPageData(pivotCache, wantedOffset, pageSize, client) {
  pivotCache.streamObserver
  .filter(() => {
    return cacheUtils.wantedPageValues(pivotCache, wantedOffset, pageSize)
  })
  .subscribe((pivotRow) => {
    client.emit('streamChunk', pivotRow)
  }, (err) => {
    console.log(err)
  }, () => {
    // client.emit('totalRowsNumber', client.pivotsCache[jaqlHash].numOfRowsCached)
    client.emit('pivotFullyCached', true)
  })
}
