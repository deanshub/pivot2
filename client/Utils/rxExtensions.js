import Rx from 'rxjs/Rx'

function emitByBuffer(subscriber, interval, buffer, lastUpdateTime){
  // debugger
  return new Promise(function (resolve) {
    if (((Date.now() - lastUpdateTime) > interval) && buffer.length>0) {
      subscriber.next(buffer)
      return resolve(true)
    } else if(buffer.length>0) {
      setTimeout(()=>{
        return emitByBuffer(subscriber, interval, buffer, lastUpdateTime)
      }, interval)
    }
  })
}

function pivotRowsBuffer(interval) {
   // We *could* do a `var self = this;` here to close over, but see next comment
  const source = this

  return Rx.Observable.create(subscriber => {
     // because we're in an arrow function `this` is from the outer scope.
    let buffer = []
    let lastUpdateTime = Date.now()

     // save our inner subscription
    let subscription = source.subscribe(value => {
       // important: catch errors from user-provided callbacks
      if (((Date.now() - lastUpdateTime) > interval) && buffer.length>0) {
        lastUpdateTime = Date.now()
        subscriber.next(buffer)
        buffer = []
      } else {
        buffer.push(value)

        if (buffer.length === 1) {
          lastUpdateTime = Date.now()
          setTimeout(()=>{
            emitByBuffer(subscriber, interval, buffer, lastUpdateTime).then(function () {
              lastUpdateTime = Date.now()
            })
          }, interval)
        }
      }
       //    try {
      //    } catch(err) {
      //      subscriber.error(err);
      //    }
    },
     // be sure to handle errors and completions as appropriate and
     // send them along
     err => subscriber.error(err),
     () => {
       subscriber.next(buffer)
       subscriber.complete()
     })

     // to return now
    return subscription
  })
}

module.exports = {
  pivotRowsBuffer,
}
