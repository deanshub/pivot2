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

    return {
      baseUrl,
      fullToken,
      parsedJaql,
      datasource,
    }
  },

  jaqlChunkToPivotData: chunks=>{
    let pivotData =[]
    let row

    chunks.forEach((chunk) => {
      row = []
      for (let key in chunk) {
        row.push(chunk[key])
      }
      pivotData.push(row)
    })

    const results = {
      // TODO: hirarchy should be set only on first step?
      hirarchy: Object.keys(chunks[0]).map((curr)=> {
        return {
          name: curr,
          type: 'row',
        }
      }),
      data: pivotData,
    }

    return results
  },
}
