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

  jaqlChunkToPivotData: chunks=>{
    let pivotData =[]
    let row

    chunks.forEach((chunk) => {
      row = []
      for (let key in chunk.data) {
        row.push(chunk.data[key])
      }
      pivotData.push(row)
    })

    return pivotData
  },
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

    rowPath.forEach((pathPart, index, rowPath)=>{
      if (index===rowPath.length-1){
        if (part[pathPart]===undefined){
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
}
