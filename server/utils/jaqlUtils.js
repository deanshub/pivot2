const hash = require('object-hash')

const jaqlHashBlacklist = [
  'explicit',
  'grandTotals',
  'format',
  'offset',
  'count',
  'field',
  'handlers',
  'merged',
  'datatype',
  'multiSelection',
  'isMaskedResult',
  'isMaskedResponse',
  'filename',
  'download',
  'widget',
  'dashboard',
  'culture',
  'isCascading',
  'collapsed',
  'table',
  'custom',
  'title',
  'column',
]

const jaqlPivotBlacklist = [
  'explicit',
  'grandTotals',
  'subtotal',
  'subtotalAgg',
  'offset',
  'count',
  'handlers',
  'isMaskedResult',
  'isMaskedResponse',
  'filename',
  'download',
  'culture',
  'isCascading',
  'collapsed',
  'title',
  'sortDetails',
  'sort',
]

function getLastRowIndexFromJaql(jaqlQueryData) {
  const rowsMetaData = getSpecificPanelFromJaql(jaqlQueryData, 'rows')

  let lastRowIndex = 0

  rowsMetaData.forEach((currRowMeta) => {
    if (currRowMeta.field && currRowMeta.field.index > lastRowIndex) {
      lastRowIndex = currRowMeta.field.index
    }
  })

  return lastRowIndex
}

function getSpecificPanelFromJaql(jaqlQueryData, wantedPanel) {
  return jaqlQueryData.metadata.filter((currMeta) => {
    return currMeta.panel === wantedPanel
  })
}

function getJaqlHash(jaql, revisionId) {
  const jaqlToHash = cleanJaqlForHash(jaql)

  jaqlToHash.revisionId = revisionId

  return hash(jaqlToHash)
}

function cleanJaqlForHash(origJaql) {
  const jaqlToClean = Object.assign({}, origJaql)

  return clearJaql(jaqlToClean, jaqlHashBlacklist)
}

function clearJaqlToPivot(origJaql) {
  const jaqlToClean = Object.assign({}, origJaql)

  return clearJaql(jaqlToClean, jaqlPivotBlacklist)
}

function clearJaql(origJaql, blacklist) {
  let currObject

  for (let key in origJaql) {
    if (!origJaql.hasOwnProperty(key)) {
      continue
    }

    currObject = origJaql[key]

    if (blacklist.indexOf(key) > -1 || key === 'disabled' && currObject === false) {
      delete origJaql[key]
      continue
    }

    // continue drilling
    if (Array.isArray(currObject) || typeof (currObject) === 'object') {
      clearJaql(currObject, blacklist)
    }
  }
  return origJaql
}

module.exports = {
  getLastRowIndexFromJaql,
  getSpecificPanelFromJaql,
  getJaqlHash,
  clearJaql,
  cleanJaqlForHash,
  clearJaqlToPivot,
}
