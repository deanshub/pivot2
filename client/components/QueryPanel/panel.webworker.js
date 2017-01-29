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
let bodyMatrix = []

const result = Rx.Observable.create(function (subscriber) {
  socket.on('streamChunk', function(data) {
    subscriber.next({data: data.row, end: data.end})
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
// .bufferCount(maxChunksLimit)
.bufferTime(maxChunksLimit)
.subscribe((chunks) => {
  if (chunks.length>0){
    // const pivotData = transformer.jaqlChunkToPivotData(chunks)
    bodyMatrix = transformer.headersDataToBodyMatrix(tempHeadersData, tempHierarchy)

    self.postMessage({
      // pivotData,
      type:'onChunks',
      bodyMatrix,
      headersData: Object.assign({},tempHeadersData),
      end: chunks[chunks.length-1].end,
    })
  }
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
