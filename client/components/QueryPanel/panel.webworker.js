import Rx from 'rxjs/Rx'
import IO from 'socket.io-client'
const socket = IO(`${location.protocol}//${location.host}`)
import transformer from '../../store/transformer.js'

//TODO: make this configurable
let maxChunksLimit = 100
let tempHierarchy
let tempHeadersData= {
  rows:{
  },
  cols:{
  },
}

// TODO: should we create\subscribe the Observable here?
const result = Rx.Observable.create(function (subscriber) {
  socket.on('streamChunk', function(data) {
    subscriber.next({data: data.row, end: data.end})
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
.do(row=>{
  const rowPath = transformer.getRowPath(tempHierarchy, row.data)
  const colPath = transformer.getColPath(tempHierarchy, row.data)
  tempHeadersData = transformer.upsertRow(tempHeadersData, rowPath, row.data)
  tempHeadersData = transformer.upsertCol(tempHeadersData, colPath, row.data)
})
.bufferTime(maxChunksLimit)
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
