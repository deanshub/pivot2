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

function getJaqlHash(jaql) {
  const jaqlToHash = {
    datasource: jaql.datasource,
    metadata: getSpecificPanelFromJaql(jaql, 'rows'),
  }

  return hash(jaqlToHash)
}

module.exports = {
  getLastRowIndexFromJaql,
  getSpecificPanelFromJaql,
  getJaqlHash,
}
