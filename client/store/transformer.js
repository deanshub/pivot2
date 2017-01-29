import {LEAF_CHILDREN_COUNT_SYM} from '../constants/symbols'

export default {
  jaqlresultToPivot: jaql => {
    const hirarchy = jaql.metadata.reduce((res, curr)=>{
      res[curr.field.index] =
        Object.assign({}, curr.field,
          {name:jaql.headers[curr.field.index], type:curr.panel}
        )

      return res
    },[])

    return {
      hirarchy,
      data: jaql.values,
    }
  },

  prepareQueryArgs: ({url, token, jaql, pageSize, pageNumber})=>{
    let jaqlJson
    try {
      const parsedPageNumber = parseInt(pageNumber)
      jaqlJson = JSON.parse(jaql)
      jaqlJson.count = parseInt(pageSize)
      jaqlJson.offset = (parsedPageNumber - 1) * pageSize
    } catch (err) {
      console.error('err', err)
      return
    }

    let baseUrl = url
    if (baseUrl.indexOf('://') > -1) {
      baseUrl = baseUrl.split('/')[2]
    } else {
      baseUrl = baseUrl.split('/')[0]
    }

    let fullToken = token

    if (!fullToken.startsWith('Bearer ')) {
      fullToken = `Bearer ${token}`
    }

    const parsedJaql = `data=${encodeURIComponent(encodeURIComponent(JSON.stringify(jaqlJson)))}`
    const datasource = jaqlJson.datasource.id || jaqlJson.datasource.fullname

    const hierarchy = jaqlJson.metadata.reduce((res, curr)=>{
      if (curr && curr.field){
        res[curr.field.index] =
        Object.assign({}, curr.field,
          {name:curr.jaql.title, type:curr.panel}
        )
      }

      return res
    },[])

    return {
      baseUrl,
      fullToken,
      parsedJaql,
      datasource,
      hierarchy,
    }
  },

  // jaqlChunkToPivotData: chunks=>{
  //   let pivotData =[]
  //   let row
  //
  //   chunks.forEach((chunk) => {
  //     row = []
  //     for (let key in chunk.data) {
  //       row.push(chunk.data[key])
  //     }
  //     pivotData.push(row)
  //   })
  //
  //   return pivotData
  // },
  getRowPath:(hierarchy, row)=>{
    const rowHierarchyIndexes = hierarchy
    .map((hierarchyPart,index)=>{
      if (hierarchyPart.type==='rows'){
        return index
      }else{
        return null
      }
    }).filter(hierarchyPart=>hierarchyPart!==null)

    return rowHierarchyIndexes.map(rowIndex=>row[rowIndex])
  },
  getColPath:(hierarchy, row)=>{
    const colHierarchyIndexes = hierarchy
    .map((hierarchyPart,index)=>{
      if (hierarchyPart.type==='columns'){
        return index
      }else{
        return null
      }
    }).filter(hierarchyPart=>hierarchyPart!==null)

    return colHierarchyIndexes.map(colIndex=>row[colIndex])
  },
  upsertRow:(headersData, rowPath, row)=>{
    let part = headersData.rows
    let updateLeafCount = false

    rowPath.forEach((pathPart, index, rowPath)=>{
      if (index===rowPath.length-1){
        if (part[pathPart]===undefined){
          updateLeafCount = true
          part[pathPart] = [row]
        }else{
          part[pathPart].push(row)
        }
      }else{
        if (part[pathPart]===undefined){
          part[pathPart] ={}
        }
      }

      part = part[pathPart]
    })

    if (updateLeafCount){
      part = headersData.rows
      rowPath.forEach((pathPart)=>{
        if (part[pathPart][LEAF_CHILDREN_COUNT_SYM]===undefined){
          part[pathPart][LEAF_CHILDREN_COUNT_SYM]=1
        }else{
          part[pathPart][LEAF_CHILDREN_COUNT_SYM]++
        }
        part = part[pathPart]
      })
    }

    return headersData
  },
  upsertCol:(headersData, colPath, row)=>{
    let part = headersData.cols
    let updateLeafCount = false

    colPath.forEach((pathPart, index, colPath)=>{
      if (index===colPath.length-1){
        if (part[pathPart]===undefined){
          updateLeafCount = true
          part[pathPart] = [row]
        }else{
          part[pathPart].push(row)
        }
      }else{
        if (part[pathPart]===undefined){
          part[pathPart] ={}
        }
      }
      part = part[pathPart]
    })

    if (updateLeafCount){
      part = headersData.cols
      colPath.forEach((pathPart)=>{
        if (part[pathPart][LEAF_CHILDREN_COUNT_SYM]===undefined){
          part[pathPart][LEAF_CHILDREN_COUNT_SYM]=1
        }else{
          part[pathPart][LEAF_CHILDREN_COUNT_SYM]++
        }
        part = part[pathPart]
      })
    }

    return headersData
  },

  headersDataToBodyMatrix:(headersData, hierarchy)=>{
    if (headersData && headersData.rows){
      let headersPart = headersData.rows

      return buildTrs(headersPart, hierarchy, headersData)
    }
  }
}


function getColPosition(hierarchy, headerColData, rowData){
  const colsPath = rowData.filter((curr,index)=>
    hierarchy[index].type==='columns'
  )
  let headerColDataPart = headerColData
  let colIndex = 0
  let colsPathIndex = 0

  while (colsPathIndex<colsPath.length){
    let colsPathPart = colsPath[colsPathIndex]
    const colPathPartPosition = Object.keys(headerColDataPart).filter(name=>name!==LEAF_CHILDREN_COUNT_SYM).indexOf(colsPathPart)
    const soFarColsKeys = Object.keys(headerColDataPart).filter(name=>name!==LEAF_CHILDREN_COUNT_SYM).filter((name, index)=>index<=colPathPartPosition)
    soFarColsKeys.forEach((colKey, index, soFarColsKeys)=>{
      if (index!==soFarColsKeys.length-1){
        colIndex += headerColDataPart[colKey][LEAF_CHILDREN_COUNT_SYM]
      }else{
        colsPathIndex++
        headerColDataPart = headerColDataPart[colKey]
      }
    })
  }
  return colIndex
}

function getRowPosition(hierarchy, headerRowData, rowData){
  const rowsPath = rowData.filter((curr,index)=>
    hierarchy[index].type==='rows'
  )
  let headerRowDataPart = headerRowData
  let rowIndex = 0
  let rowsPathIndex = 0

  while (rowsPathIndex<rowsPath.length){
    let rowsPathPart = rowsPath[rowsPathIndex]
    const rowPathPartPosition = Object.keys(headerRowDataPart).filter(name=>name!==LEAF_CHILDREN_COUNT_SYM).indexOf(rowsPathPart)
    const soFarRowsKeys = Object.keys(headerRowDataPart).filter(name=>name!==LEAF_CHILDREN_COUNT_SYM).filter((name, index)=>index<=rowPathPartPosition)
    soFarRowsKeys.forEach((rowKey, index, soFarRowsKeys)=>{
      if (index!==soFarRowsKeys.length-1){
        rowIndex += headerRowDataPart[rowKey][LEAF_CHILDREN_COUNT_SYM]
      }else{
        rowsPathIndex++
        headerRowDataPart = headerRowDataPart[rowKey]
      }
    })
  }
  return rowIndex
}

function buildTrs(headersDataPart, hierarchy, headersData){
  const sectionTrs = Object.keys(headersDataPart)
  .filter(name=>name!==LEAF_CHILDREN_COUNT_SYM)
  .map(rowName=>{
    return Array.from(Array(headersDataPart[rowName][LEAF_CHILDREN_COUNT_SYM])).map(()=>[])

  }).reduce((res,cur)=>res.concat(cur))

  return builTds([headersDataPart], hierarchy, headersData, sectionTrs)
}

function builTds(headersDataParts, hierarchy, headersData, trs){
  while (!Array.isArray(headersDataParts[0])){
    let currIndex = 0
    headersDataParts.forEach((headersDataPart) => {
      Object.keys(headersDataPart)
      .filter(name=>name!==LEAF_CHILDREN_COUNT_SYM)
      .map(rowName=>{
        trs[currIndex].push({displayValue:rowName,rowspan:headersDataPart[rowName][LEAF_CHILDREN_COUNT_SYM]})

        currIndex += headersDataPart[rowName][LEAF_CHILDREN_COUNT_SYM]
      })
    })

    headersDataParts = headersDataParts.map(headerPart=>{
      return Object.keys(headerPart).map(headerPartName=>{
        return headerPart[headerPartName]
      }).reduce((res,cur)=>res.concat(cur), [])
    }).reduce((res,cur)=>res.concat(cur), [])
  }

  // TODO: don't create the keys everytime
  const matrixColsCount = Object.keys(headersData.cols).reduce((res, curr)=> {
    return res + headersData.cols[curr][LEAF_CHILDREN_COUNT_SYM]
  },0)

  const matrixRowsCount = Object.keys(headersData.rows).reduce((res, curr)=> {
    return res + headersData.rows[curr][LEAF_CHILDREN_COUNT_SYM]
  },0)

  const measuresCount = hierarchy.filter((curr)=> {
    return curr.type === 'measures'
  }).length

  let matrix = Array.from(Array(matrixRowsCount)).map(()=> {
    return Array.from(Array(matrixColsCount * measuresCount))
  })

  headersDataParts.forEach((currPart) => {
    if (Array.isArray(currPart)) {
      const rowPart = getRowPosition(hierarchy, headersData.rows, currPart)
      const colPart = getColPosition(hierarchy, headersData.cols, currPart)

      const measures = currPart.filter((curr,index)=>
        hierarchy[index].type === 'measures'
      )

      measures.forEach((currMeasure, index) => {
        matrix[rowPart][colPart*measures.length + index] = currMeasure
      })
    }
  })

  trs = trs.map((currTr, index) => {
    const dataTds = matrix[index].map(currRow => {
      // let tdClassNames = []
      //
      // if (index % 2 === 0) {
      //   tdClassNames.push(style.evenRow)
      // }
      //
      // if ((index2 + 1) % measuresCount === 0) {
      //   tdClassNames.push(style.sectionCol)
      // } else {
      //   tdClassNames.push(style.normalCol)
      // }
      //
      // tdClassNames.push(style.cell)
      return {displayValue:currRow ? parseFloat(currRow).toFixed(2) : currRow}
      // return (<td className={classnames(tdClassNames)} key={index+'.'+index2}>{currRow ? parseFloat(currRow).toFixed(2) : currRow }</td>)
    })
    const newRow = currTr.concat(dataTds)
    return newRow
  })

  return trs
}
