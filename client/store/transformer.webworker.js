import transformer from './transformer.js'

addEventListener('message', (e) => {
  const jaql = e.data
  const pivotData = transformer.jaqlresultToPivot(jaql)
  postMessage(pivotData)
})
