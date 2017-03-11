function initCacheForJaql(client, jaqlHash) {
  if (!client.pivotsCache[jaqlHash]) {
    client.pivotsCache[jaqlHash] = {}
  }

  if (!client.pivotsCache[jaqlHash].rawData) {
    client.pivotsCache[jaqlHash].rawData = []
  }

  if (!client.pivotsCache[jaqlHash].dataDictionary) {
    client.pivotsCache[jaqlHash].dataDictionary = []
  }

  return client.pivotsCache[jaqlHash]
}

function initCacheForStream(pivotCache) {
  pivotCache.currRowIndex = 0
  pivotCache.numOfRowsCached = -1
  pivotCache.lastRow = []
}

function addDataToCache(pivotCache, data) {
  pivotCache.rawData.push(data)
}

function addPivotRowToDataDictionary(pivotCache, pivotRow) {
  pivotCache.dataDictionary.push({
    start: pivotCache.currRowIndex,
    end: pivotCache.currRowIndex + pivotRow.length - 1,
  })

  pivotCache.currRowIndex += pivotRow.length

  pivotCache.numOfRowsCached += 1
}

function emitCachedPage(client, pivotCache, wantedOffset, pageSize) {
  const dataDictionaryFirstValue = getDictionaryData(pivotCache, wantedOffset)
  let rawDataOffset = dataDictionaryFirstValue.start


  for (let pivotRowIndex = 0; pivotRowIndex < pageSize; pivotRowIndex++) {
    const pivotOffset = wantedOffset + pivotRowIndex

    const dataDictionaryValue = pivotCache.dataDictionary[pivotOffset]
    const pivotRowDataChunksCount =
      (dataDictionaryValue.end - dataDictionaryValue.start) + 1

    let currPivotRow = []

    for (let dataChunksIndex = 0; dataChunksIndex < pivotRowDataChunksCount; dataChunksIndex++) {
      currPivotRow.push(pivotCache.rawData[rawDataOffset])
    }

    client.emit('streamChunk', currPivotRow)

    rawDataOffset = rawDataOffset + pivotRowDataChunksCount
  }
}

function emitTotalPagesCached(client, pivotCache, pageSize, emitEveryXPages) {
  const cachedRowsNum = getCachedRowsNum(pivotCache)
  const totalPagesCached = Math.ceil(cachedRowsNum / pageSize)
  let shouldEmitPages = true

  if (emitEveryXPages && (totalPagesCached % emitEveryXPages !== 0)) {
    shouldEmitPages = false
  }

  if (shouldEmitPages) {
    client.emit('totalPagesCached', totalPagesCached)
  }
}

function getCachedRowsNum(pivotCache) {
  return pivotCache.numOfRowsCached
}

function getCachedPagesNum(pivotCache, pageSize) {
  const cachedRowsNum = getCachedRowsNum(pivotCache)
  const cachedPagesNum = Math.floor(cachedRowsNum / pageSize)

  return cachedPagesNum
}

function getDictionaryData(pivotCache, rowNumber) {
  return pivotCache.dataDictionary[rowNumber]
}

function fullPageCached(pivotCache, pageSize) {
  const cachedRowsNum = getCachedRowsNum(pivotCache)
  const fullPageCached = cachedRowsNum % pageSize === 0

  return fullPageCached
}

function wantedPageValues(pivotCache, wantedOffset, pageSize) {
  const cachedRowsNum = getCachedRowsNum(pivotCache)
  const pageStart = wantedOffset
  const pageEnd = wantedOffset + pageSize

  return ((cachedRowsNum >= pageStart) && (cachedRowsNum < pageEnd))
}

function checkIfPageCached(pivotCache, wantedOffset, pageSize) {
  const pageStartCached = getDictionaryData(pivotCache, wantedOffset)
  const pageEndCached = getDictionaryData(pivotCache, wantedOffset + pageSize)

  return (pageStartCached && pageEndCached)
}

module.exports = {
  initCacheForJaql,
  initCacheForStream,
  addDataToCache,
  addPivotRowToDataDictionary,
  emitCachedPage,
  emitTotalPagesCached,
  getCachedRowsNum,
  getCachedPagesNum,
  getDictionaryData,
  fullPageCached,
  wantedPageValues,
  checkIfPageCached,
}
