import Rx from 'rxjs/Rx'
import IO from 'socket.io-client'
import rxExtensions from '../../Utils/rxExtensions.js'
import pivotCacheUtils from '../../Utils/pivotCacheUtils.js'
import transformer from '../../store/transformer.js'

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

socket.on('totalRowsNumber', (totalRowsNumber) => {
  self.postMessage({
    type:'totalRowsNumber',
    totalRowsNumber,
  })
})


const subscriber = result
.filter(chunk=>!chunk.end)
.do((pivotRow) => {
  pivotCacheUtils.updatePivotModel(tempHierarchy, tempHeadersData, pivotRow)
})
// .bufferTime(maxChunksLimit)
.pivotRowsBuffer(maxChunksLimit)
// .concatAll()
.filter(chunks=>chunks.length>0)
.subscribe((chunks) => {
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
    const {baseUrl, fullToken, parsedJaql, datasource, hierarchy} = e.data
    tempHierarchy = hierarchy
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
