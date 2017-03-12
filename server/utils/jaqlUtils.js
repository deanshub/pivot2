const hash = require('object-hash')

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
  const jaqlToHash = cleanJaql(jaql)

  jaqlToHash.revisionId = revisionId

  return hash(jaqlToHash)
}

const blacklist = [
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

function cleanJaql(origJaql) {
  const jaqlToClean = Object.assign({}, origJaql)

  let currObject

  for (let key in jaqlToClean) {
    if (!jaqlToClean.hasOwnProperty(key)) {
      continue
    }

    currObject = jaqlToClean[key]

    if (blacklist.indexOf(key) > -1 || key === 'disabled' && currObject === false) {
      delete jaqlToClean[key]
      continue
    }

    // continue drilling
    if (Array.isArray(currObject) || typeof (currObject) === 'object') {
      cleanJaql(currObject)
    }
  }

  return jaqlToClean
}

module.exports = {
  getLastRowIndexFromJaql,
  getSpecificPanelFromJaql,
  getJaqlHash,
  cleanJaql,
}
