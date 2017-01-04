const possible = ' ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export const generate = (spec, amount)=>{
  console.time('data generation')
  spec.forEach((col)=>{
    for (let index=0; index<col.amount; index++){
      if (col.amount){
        if (!col.data){
          col.data = []
        }

        col.data.push(generateByType(col))
      }
    }
  })

  let data = []
  for (let index=0; index<amount; index++){
    const row = spec.reduce((res,col)=>{
      if (!col.data){
        res[col.name] = generateByType(col)
      }else{
        res[col.name] = col.data[generateInt(0, col.data.length-1)]
      }
      return res
    }, {})
    data.push(row)
  }
  console.timeEnd('data generation')
  return data
  // 'Contoso Florida', 'Proseware LCD17W E202 Black', 'Proseware, Inc.', 'Economy', 'Monitors', 4, 509.55
  // spec
}

export const generateString = (length)=>{
  let text =''
  for (let index=0;index<length; index++){
    text+= possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

export const generateInt= (min, max)=> {
  return Math.floor(Math.random()*(max-min+1)+min)
}

export const generateFloat= (min, max, precision)=> {
  const number = Math.random()*(max-min+1)+min
  if (precision!==undefined){
    return 1* number.toFixed(precision)
  }else{
    return number
  }
}

export const generateDate = (start=new Date(0), end=new Date())=>{
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

export const generateByType = (col)=>{
  if (col.type === 'string'){
    return generateString(col.length)
  }else if (col.type === 'integer'){
    return generateInt(col.min, col.max)
  }else if (col.type === 'date'){
    return generateDate(col.start, col.end)
  }else if (col.type === 'float'){
    return generateFloat(col.min, col.max, col.precision)
  }
}
