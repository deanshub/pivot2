import Rx from 'rxjs/Rx'
import IO from 'socket.io-client'
const socket = IO(`${location.protocol}//${location.host}`)

import transformer from '../../store/transformer.js'

let chunks = []
let maxChunksLimit = 100

let result = Rx.Observable.create(function (subscriber) {
  socket.on('streamChunk', function(data) {
    subscriber.next({data, end: data.end})
  })
})
const subscriber = result
.filter(chunk=>!chunk.end)
.bufferCount(maxChunksLimit)
.subscribe((chunks) => {
  if (chunks.length>0){
    const pivotData = transformer.jaqlChunkToPivotData(chunks)

    self.postMessage({
      type:'onChunks',
      pivotData,
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
    const {baseUrl, fullToken, parsedJaql, datasource} = e.data
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
