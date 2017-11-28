function getByPath(obj, path) {
  return path.split('.').reduce((res, pathPart)=>{
    return res?res[pathPart]:undefined
  },obj)
}

function consolidateHeads(rowsHeaders, colsHeaders, dataHeaders, hierarchies, bodyData){
  if (!hierarchies){
    return []
  }
  const rowsExists = hierarchies.hierarchyRows.length>0
  const colsExists = hierarchies.hierarchyCols.length>0
  const dataExists = hierarchies.hierarchyData.length>1&&bodyData.length>0

  let headerMatrix = []
  let dataCellsAmountToAdd

  if (!rowsExists && !colsExists && !dataExists){
    // TODO: take care of 1 data
    headerMatrix = [[]]
    dataCellsAmountToAdd = dataHeaders.length
  }else if(colsExists && dataExists){
    // hierarchyCols.length + 1
    headerMatrix = Array.from(Array(colsHeaders.length + 1)).map(()=> {
      return []
    })

    dataCellsAmountToAdd = bodyData[0].length / hierarchies.hierarchyData.length
  }else if(rowsExists && !colsExists && !dataExists){
    headerMatrix = [[]]
    dataCellsAmountToAdd = dataHeaders.length
    // 1
  }else if(colsExists || dataExists){
    if (dataExists) {
      headerMatrix = [[]]
      dataCellsAmountToAdd = bodyData[0].length / hierarchies.hierarchyData.length
    } else {
      headerMatrix = Array.from(Array(colsHeaders.length)).map(()=> {
        return []
      })

      dataCellsAmountToAdd = 0
    }
    // hierarchyCols.length || 1
  }

  headerMatrix[0] = headerMatrix[0].concat(rowsHeaders)

  colsHeaders.forEach((currRow, index) => {
    headerMatrix[index] = headerMatrix[index].concat(currRow)
  })

  for (let index = 0; index < dataCellsAmountToAdd; index++) {
    headerMatrix[headerMatrix.length-1] = headerMatrix[headerMatrix.length-1].concat(dataHeaders)
  }

  return headerMatrix
}

function getSubTotalsFromJaql(jaql) {
  const jaqlColumns = getSpecificPanelFromJaql(jaql, 'columns')
  const jaqlRows = getSpecificPanelFromJaql(jaql, 'rows')

  const jaqlRowsSubTotals = jaqlRows.filter((row) => {
    return getByPath(row, 'format.subtotal')
  }).map((subtotalPart) => {
    return subtotalPart.field.index
  }).sort()

  const jaqlColumnsSubTotals = jaqlColumns.filter((column) => {
    return getByPath(column, 'format.subtotal')
  }).map((subtotalPart) => {
    return subtotalPart.field.index - jaqlRows.length
  }).sort()

  const jaqlSubTotals = {
    rowsLayers: jaqlRowsSubTotals,
    columnsLayers: jaqlColumnsSubTotals,
  }

  return jaqlSubTotals
}

function getSpecificPanelFromJaql(jaqlQueryData, wantedPanel) {
  return jaqlQueryData.metadata.filter((currMeta) => {
    return currMeta.panel === wantedPanel
  })
}

module.exports = {
  getByPath,
  consolidateHeads,
  getSubTotalsFromJaql,
}
