import transformer from '../store/transformer.js'


function updatePivotModel(tempHierarchy, tempHeadersData, pivotRow, pivotSubTotals) {
  pivotRow.forEach((dataChunk) => {
    const rowPath = transformer.getRowPath(tempHierarchy, dataChunk)
    const colPath = transformer.getColPath(tempHierarchy, dataChunk)
    tempHeadersData = transformer.upsertRow(tempHeadersData, rowPath, dataChunk, pivotSubTotals.rowsLayers)
    tempHeadersData = transformer.upsertCol(tempHeadersData, colPath, dataChunk, pivotSubTotals.columnsLayers)
  })

  return tempHeadersData
}


module.exports = {
  updatePivotModel,
}
