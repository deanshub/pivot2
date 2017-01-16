import Rx from 'rxjs/Rx'
import IO from 'socket.io-client'
const socket = IO(`${location.protocol}//${location.host}`)

import transformer from '../../store/transformer.js'

let chunks = []
let chunksLimit = 1

let result = Rx.Observable.create(function (subscriber) {
  socket.on('streamChunk', function(data) {
    if (chunks.length >= chunksLimit || data.end) {
      subscriber.next(chunks)
      chunks = []
    } else {
      chunks.push(data)
    }
  })
})
const subscriber = result.subscribe((data) => {
  self.postMessage({data, type:'onChunks'})
})

self.addEventListener('message', (e) => {
  const {type} = e.data
  if (type==='prepareQueryArgs'){
    const {url, token, jaql} = e.data
    const result = transformer.prepareQueryArgs(url, token, jaql)
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
