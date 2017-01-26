import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
import {LEAF_CHILDREN_COUNT_SYM} from '../../constants/symbols'
// TODO: remove this from here, should only be in the webworker
import transformer from '../../store/transformer'

export default class PivotBody extends Component {
  static propTypes = {
    hierarchy: PropTypes.array,
    headersData: PropTypes.object,
  }

  addToPivot(){
    const {headersData, hierarchy} = this.props
    if (headersData && headersData.rows){
      let headersPart = headersData.rows

      return this.buildTrs(headersPart, hierarchy, headersData).map(tr=><tr>{tr}</tr>)
    }
  }

  buildTrs(headersDataPart, hierarchy, headersData){
    const sectionTrs = Object.keys(headersDataPart)
    .filter(name=>name!==LEAF_CHILDREN_COUNT_SYM)
    .map(rowName=>{
      return Array.from(Array(headersDataPart[rowName][LEAF_CHILDREN_COUNT_SYM])).map(()=>[])

    }).reduce((res,cur)=>res.concat(cur))

    return this.builTds([headersDataPart], hierarchy, headersData, sectionTrs)
  }

  builTds(headersDataParts, hierarchy, headersData, trs){
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

    const matrixColsCount = Object.keys(headersData.cols).reduce((res, curr)=> {
      return res + headersData.cols[curr][LEAF_CHILDREN_COUNT_SYM]
    },0)

    const matrixRowsCount = Object.keys(headersData.rows).reduce((res, curr)=> {
      return res + headersData.rows[curr][LEAF_CHILDREN_COUNT_SYM]
    },0)

    const measuresCount = hierarchy.filter((curr)=> {
      return curr.type === 'measures'
    }).length

    let matrix = Array.from(Array(matrixRowsCount)).map((curr)=> {
      return Array.from(Array(matrixColsCount * measuresCount))
    })

    headersDataParts.forEach((currPart) => {
      if (Array.isArray(currPart)) {
        const rowPart = transformer.getRowPosition(hierarchy, headersData.rows, currPart)
        const colPart = transformer.getColPosition(hierarchy, headersData.cols, currPart)

        const measures = currPart.filter((curr,index)=>
          hierarchy[index].type === 'measures'
        )

        measures.forEach((currMeasure, index) => {
          matrix[rowPart][colPart*measures.length + index] = currMeasure
        })
      }
    })

    trs = trs.map((currTr, index) => {
      const dataTds = matrix[index].map((currRow,index2) => {
        let tdClassNames = [];

        if (index % 2 === 0) {
          tdClassNames.push(style.evenRow)
        }

        if ((index2 + 1) % measuresCount === 0) {
          tdClassNames.push(style.sectionCol)
        } else {
          tdClassNames.push(style.normalCol)
        }

        tdClassNames.push(style.cell)

        return (<td className={classnames(tdClassNames)} key={index+'.'+index2}>{currRow ? parseFloat(currRow).toFixed(2) : currRow }</td>)
      })
      const temp = currTr.concat(dataTds)
      return temp
    })

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
