import Rx from 'rxjs/Rx'
import IO from 'socket.io-client'
import rxExtensions from '../../Utils/rxExtensions.js'
import pivotCacheUtils from '../../Utils/pivotCacheUtils.js'
import transformer from '../../store/transformer.js'
import { SUBTOTALS_DATA_COUNT_SYM } from '../../constants/symbols'


const socket = IO(`${location.protocol}//${location.host}`)

//TODO: make this configurable
let maxChunksLimit = 300
let tempHierarchy
let tempHeadersData= {
  rows:{
  },
  cols:{
  },
}

let pivotSubTotals = {
  rowsLayers: [],
  columnsLayers: [],
}

Rx.Observable.prototype.pivotRowsBuffer = rxExtensions.pivotRowsBuffer

// TODO: should we create\subscribe the Observable here?
const result = Rx.Observable.create(function (subscriber) {
  socket.on('streamChunk', function(pivotRow) {
    subscriber.next(pivotRow)
  })
})

socket.on('totalPagesCached', (totalPagesCached) => {
  self.postMessage({
    type:'totalPagesCached',
    totalPagesCached,
  })
})

const subtotalsStream = Rx.Observable.create(function (subscriber) {
  socket.on('subtotalChunk', function(subtotalChunk) {
    subscriber.next(subtotalChunk)
  })
})

socket.on('totalRowsNumber', (totalRowsNumber) => {
  self.postMessage({
    type:'totalRowsNumber',
    totalRowsNumber,
  })
})

const subscriber = result
.filter(chunk=>!chunk.end)
.do((pivotRow) => {
  pivotCacheUtils.updatePivotModel(tempHierarchy, tempHeadersData, pivotRow, pivotSubTotals)
})
.pivotRowsBuffer(maxChunksLimit)
.filter(chunks=>chunks.length>0)
.subscribe((chunks) => {
  // TODO: Change this logic
  const headersData = transformer.getHeadersData(tempHeadersData, tempHierarchy)
  const rowsHeadersAndBodyData = transformer.headersDataToBodyMatrix(tempHeadersData, tempHierarchy)

  self.postMessage({
    type:'onChunks',
    rowsPanelHeaders: rowsHeadersAndBodyData.bodyDataRowsHeaders,
    bodyData: rowsHeadersAndBodyData.bodyData,
    headersData,
    end: chunks[chunks.length-1].end,
  })
})

self.addEventListener('message', (e) => {
  const {type} = e.data
  if (type==='prepareQueryArgs'){
    const {url, token, jaql, chunksLimit, pageSize, pageNumber} = e.data
    maxChunksLimit = chunksLimit
    const result = transformer.prepareQueryArgs({url, token, jaql, pageSize, pageNumber})
    self.postMessage({...result, type:'startQuery'})
  } else if (type==='startStreamRequest') {
    const {baseUrl, fullToken, parsedJaql, datasource, hierarchy, subTotals, grandTotals} = e.data
    pivotSubTotals = subTotals
    tempHierarchy = hierarchy

    if (grandTotals.columns) {
      tempHeadersData.cols[SUBTOTALS_DATA_COUNT_SYM] = []
    }

    if (grandTotals.rows) {
      tempHeadersData.rows[SUBTOTALS_DATA_COUNT_SYM] = []
    }

    // tempHeadersData= {
    //   rows:{
    //   },
    //   cols:{
    //   },
    // }
    socket.emit('streamRequest', {
      jaql: parsedJaql,
      token: fullToken,
      baseUrl: `http://${baseUrl}`,
      datasource,
    })
  } else if (type==='cancelStream') {
    if (subscriber && typeof(subscriber.dispose)==='function'){
      subscriber.dispose()
    }
    socket.emit('cancelStream')
  }
})
