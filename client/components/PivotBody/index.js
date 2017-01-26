import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
import {LEAF_CHILDREN_COUNT_SYM} from '../../constants/symbols'


export default class PivotBody extends Component {
  static propTypes = {
    hierarchy: PropTypes.array,
    headersData: PropTypes.object,
  }

  addToPivot(){
    const {headersData, hierarchy} = this.props
    console.log(headersData);
    if (headersData && headersData.rows){
      let headersPart = headersData.rows
      const hierarchyData = hierarchy.map((header, index)=>header.type==='measures'&&index)
      .filter(header=>header!==false)

      return this.buildTrs(headersPart, hierarchyData).map(tr=><tr>{tr}</tr>)
    }
  }

  buildTrs(headersDataPart, hierarchyData){
    const sectionTrs = Object.keys(headersDataPart)
    .filter(name=>name!==LEAF_CHILDREN_COUNT_SYM)
    .map(rowName=>{
      return Array.from(Array(headersDataPart[rowName][LEAF_CHILDREN_COUNT_SYM])).map(()=>[])

    }).reduce((res,cur)=>res.concat(cur))

    return this.builTds([headersDataPart], hierarchyData, sectionTrs)
  }

  builTds(headersDataParts, hierarchyData, trs){
    while (!Array.isArray(headersDataParts[0])){
      let currIndex = 0
      headersDataParts.forEach((headersDataPart) => {
        Object.keys(headersDataPart)
        .filter(name=>name!==LEAF_CHILDREN_COUNT_SYM)
        .map((rowName)=>{
          trs[currIndex].push(<td className={classnames(style.col)} rowSpan={headersDataPart[rowName][LEAF_CHILDREN_COUNT_SYM]}>{rowName}</td>)

          currIndex += headersDataPart[rowName][LEAF_CHILDREN_COUNT_SYM]
        })
      })

      headersDataParts = headersDataParts.map(headerPart=>{
        return Object.keys(headerPart).map(headerPartName=>{
          return headerPart[headerPartName]
        }).reduce((res,cur)=>res.concat(cur), [])
      }).reduce((res,cur)=>res.concat(cur), [])
    }

    return trs
  }

  render() {
    return (
      <tbody>
        {this.addToPivot()}
      </tbody>
    )
  }
}
