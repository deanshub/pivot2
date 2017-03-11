import transformer from '../store/transformer.js'


function updatePivotModel(tempHierarchy, tempHeadersData, pivotRow) {
  pivotRow.forEach((dataChunk) => {
    const rowPath = transformer.getRowPath(tempHierarchy, dataChunk)
    const colPath = transformer.getColPath(tempHierarchy, dataChunk)
    tempHeadersData = transformer.upsertRow(tempHeadersData, rowPath, dataChunk)
    tempHeadersData = transformer.upsertCol(tempHeadersData, colPath, dataChunk)
  })

  return tempHeadersData
}


module.exports = {
  updatePivotModel,

}
