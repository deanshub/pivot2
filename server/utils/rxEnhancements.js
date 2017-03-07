const Rx = require('rxjs/Rx')
const R = require('ramda')

function newPivotRowValue(previousValue = [], value, lastRowIndex){
  const previousSlicedValue = previousValue.slice(0, lastRowIndex + 1)
  const slicedValue = value.slice(0, lastRowIndex + 1)

  return !R.equals(previousSlicedValue, slicedValue)
}

function groupToPivotRow(lastRowIndex) {
  // We *could* do a `var self = this;` here to close over, but see next comment
  const source = this

  return Rx.Observable.create(subscriber => {
    // because we're in an arrow function `this` is from the outer scope.
    let buffer = []

    // save our inner subscription
    const subscription = source.subscribe(value => {
      // important: catch errors from user-provided callbacks
      if (newPivotRowValue(buffer[buffer.length-1],value, lastRowIndex)) {
        try {
          subscriber.next(buffer)
          buffer = []
        } catch(err) {
          subscriber.error(err)
        }
      }

      buffer.push(value)
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

/**
  * Converts a flowing stream to an Observable sequence.
  * @param {Stream} stream A stream to convert to a observable sequence.
  * @param {String} [finishEventName] Event that notifies about closed stream. ("end" by default)
  * @param {String} [dataEventName] Event that notifies about incoming data. ("data" by default)
  * @returns {Observable} An observable sequence which fires on each 'data' event as well as handling 'error' and finish events like `end` or `finish`.
  */
function fromStream(stream, finishEventName, dataEventName) {
  stream.pause()

  finishEventName = finishEventName || 'end'
  dataEventName = dataEventName || 'data'

  return Rx.Observable.create(function (observer) {
    function dataHandler (data) {
      observer.next(data)
    }

    function errorHandler (err) {
      observer.error(err)
    }

    function endHandler () {
      observer.complete()
    }

    stream.addListener(dataEventName, dataHandler)
    stream.addListener('error', errorHandler)
    stream.addListener(finishEventName, endHandler)

    stream.resume()

    return function () {
      stream.removeListener(dataEventName, dataHandler)
      stream.removeListener('error', errorHandler)
      stream.removeListener(finishEventName, endHandler)
    }
  }).share()
}

module.exports = {
  newPivotRowValue,
  groupToPivotRow,
  fromStream,
}
