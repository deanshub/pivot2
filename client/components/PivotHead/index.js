import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
import {LEAF_CHILDREN_COUNT_SYM} from '../../constants/symbols'


export default class PivotHead extends Component {
  static propTypes = {
    hierarchy: PropTypes.array,
    headersData: PropTypes.object,
  }
  static defaultProps = {
    hierarchy : [],
  }

  buildTrsForColumns(colsData, hierarchyCols, hierarchyRows, dataTh, colspan){
    let trs=[]
    const colsHeaders = Object.keys(colsData).filter(key=>key!==LEAF_CHILDREN_COUNT_SYM)
    const rowsHeaders = hierarchyRows.map((hierarchyRow, index)=>
      <th
          className={classnames(style.th)}
          key={index}
          rowSpan={hierarchyCols.length+1}
      >
        {hierarchyRow.name}
      </th>
    )
    trs.push(rowsHeaders)

    if (colsHeaders.length>0){
      const colTh = colsHeaders.map((hierarchyColsName, index)=>{
        return (
          <th
              className={classnames(style.th)}
              colSpan={colsData[hierarchyColsName][LEAF_CHILDREN_COUNT_SYM]*colspan}
              key={rowsHeaders.length + index}
          >
            {hierarchyColsName}
          </th>
        )
      })
      trs[0] = trs[0].concat(colTh)

      let currRow = [colsData]
      while (!Array.isArray(currRow[0])){
        const innerThs = this.buildInnerThs(currRow, colspan)
        trs.push(innerThs)
        currRow = currRow.map(rowName=>Object.keys(rowName).map(name=>rowName[name]))
      }

      trs.push(trs[trs.length-1].map(()=>dataTh))
    }else{
      trs[0] = trs[0].concat(dataTh)
    }
    return trs.map((ths,index)=><tr key={index}>{ths}</tr>)
  }

  buildInnerThs(colsDataArr, colspan){
    const innerThs = colsDataArr.map((colsData)=>{
      return Object.keys(colsData).filter(key=>key!==LEAF_CHILDREN_COUNT_SYM).map((hierarchyColsName, index1)=>{
        return Object.keys(colsData[hierarchyColsName]).filter(key=>key!==LEAF_CHILDREN_COUNT_SYM).map((hierarchyColsName2, index2)=>{
          return (
            <th
                className={classnames(style.th)}
                colSpan={colsData[hierarchyColsName][hierarchyColsName2][LEAF_CHILDREN_COUNT_SYM]*colspan}
                key={index1+'.'+index2}
            >
              {hierarchyColsName2}
            </th>)
        })
      }).reduce((res,cur)=>res.concat(cur),[])
    }).reduce((res,cur)=>res.concat(cur),[])
    return innerThs
  }


  getHeaders(headersData={cols:{},rows:{}}, hierarchy){
    let colspan = 1
    const hierarchyRows = hierarchy.filter(header=>header.type==='rows')
    const hierarchyCols = hierarchy.filter(header=>header.type==='columns')
    const hierarchyData = hierarchy.filter(header=>header.type==='measures')

    const rowsExists = hierarchyRows.length>0
    const colsExists = hierarchyCols.length>0
    const dataExists = hierarchyData.length>1

    if (!rowsExists && !colsExists && !dataExists){
      // TODO: take care of 1 data
      const dataTh = hierarchyData.map((hierarchyDataPart, index)=>
        <th
            className={classnames(style.th)}
            colSpan={colspan}
            key={'d'+index}
        >
          {hierarchyDataPart.name}
        </th>
      )
      return [<tr key={1}>{dataTh}</tr>]
    }else if(colsExists && dataExists){
      const dataTh = hierarchyData.map((hierarchyDataPart, index)=>
        <th
            className={classnames(style.th)}
            colSpan={colspan}
            key={'d'+index}
        >
          {hierarchyDataPart.name}
        </th>
      )
      colspan = dataTh.length
      const trs = this.buildTrsForColumns(headersData.cols, hierarchyCols, hierarchyRows, dataTh, colspan)

      return trs

      // hierarchyCols.length + 1
    }else if(rowsExists && !colsExists && !dataExists){
      const dataTh = hierarchyData.map((hierarchyDataPart, index)=>
        <th
            className={classnames(style.th)}
            colSpan={colspan}
            key={'d'+index}
        >
          {hierarchyDataPart.name}
        </th>
      )
      colspan = dataTh.length
      const trs = this.buildTrsForColumns(headersData.cols, hierarchyCols, hierarchyRows, dataTh, colspan)
      return trs
      // 1
    }else if(colsExists || dataExists){
      const dataTh = hierarchyData.map((hierarchyDataPart, index)=>
        <th
            className={classnames(style.th)}
            colSpan={colspan}
            key={'d'+index}
        >
          {hierarchyDataPart.name}
        </th>
      )
      colspan = dataTh.length || 1
      const trs = this.buildTrsForColumns(headersData.cols, hierarchyCols, hierarchyRows, dataTh, colspan)
      return trs
      // hierarchyCols.length || 1
    }
  }

  render() {
    const {headersData, hierarchy} = this.props

    return (
      <thead>
        {this.getHeaders(headersData, hierarchy)}
      </thead>
    )
  }
}
