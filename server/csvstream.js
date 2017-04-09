const Rx = require('rxjs/Rx')
const request = require('request')
const CsvStream = require('csv-stream')
const rxEnhancements = require('./utils/rxEnhancements.js')
const jaqlUtils = require('./utils/jaqlUtils.js')
const cacheUtils = require('./utils/cacheUtils.js')
const sisenseUtils = require('./utils/sisenseUtils.js')

Rx.Observable.prototype.groupToPivotRow = rxEnhancements.groupToPivotRow


const options = {
  delimiter : ',', // default is ,
  endLine : '\n', // default is \n,
  escapeChar : '"', // default is an empty string
  enclosedChar : '"', // default is an empty string
}

const csvStream = CsvStream.createStream(options)

let caches={}

function streamCSV(jaql, token, baseUrl, datasource) {
  const jaqlJson = JSON.parse(decodeURIComponent(decodeURIComponent(jaql.slice(5))))

  const lastRowIndex = jaqlUtils.getLastRowIndexFromJaql(jaqlJson)

  const pageSize = jaqlJson.count
  const wantedOffset = jaqlJson.offset

  sisenseUtils.getRevisionId(baseUrl, datasource, token).then((revisionId) => {
    const jaqlHash = jaqlUtils.getJaqlHash(jaqlJson, revisionId)
    const pivotJaql = jaqlUtils.clearJaqlToPivot(jaqlJson)
    const pivotCache = cacheUtils.initCacheForJaql(caches, jaqlHash)

    if (!pivotCache.streamObserver) {
      pivotJaql.format='csv'
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


    streamPageData(pivotCache, wantedOffset, pageSize)
  })
}

function streamPageData(pivotCache, wantedOffset, pageSize) {
  return pivotCache.streamObserver
  .filter(() => {
    return cacheUtils.wantedPageValues(pivotCache, wantedOffset, pageSize)
  })
  .subscribe((pivotRow) => {
    console.log('streaming...')
  }, (err) => {
    console.log(err)
  }, () => {
    console.log('stream ended')
  })
}

module.exports = {
  streamCSV,
}
