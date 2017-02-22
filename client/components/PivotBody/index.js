import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import helpers from '../../Utils/helpers.js'
import classnames from 'classnames'
import style from './style.css'

export default class PivotBody extends Component {
  static propTypes = {
    additionalStyle: PropTypes.object,
    bodyData: PropTypes.array,
    className: PropTypes.string,
    rowsHeaders: PropTypes.array,
    rowsPanelSizes: PropTypes.array,
    scrollTop: PropTypes.number,
    headerSizes: PropTypes.array,
    userDefinedSize: PropTypes.bool,
  }
  static defaultProps = {
    bodyData: [],
    rowsPanelHeaders: [],
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentDidUpdate() {
    const {scrollTop} = this.props

    if (scrollTop !== undefined) {
      this.container.scrollTop = scrollTop
    }
  }


  consolidateBody(bodyDataRowsHeaders, bodyData){
    if (bodyDataRowsHeaders.length === 0) {
      return bodyData
    }

    return bodyDataRowsHeaders.map((row, index)=>{
      return row.concat(bodyData[index] || [])
    })
  }

  render() {
    const {
      rowsPanelHeaders,
      bodyData,
      rowsPanelSizes,
      className,
      additionalStyle,
      headerSizes,
      userDefinedSize,
    } = this.props

    const bodyMatrix = this.consolidateBody(rowsPanelHeaders, bodyData)
    const lastRow = userDefinedSize?headerSizes[headerSizes.length-1]:[]
    return (
      <tbody
          className={className}
          ref={container=>this.container=container}
          style={additionalStyle}
      >
        {
          bodyMatrix.map((row, rowIndex)=>
          <tr key={rowIndex}>
          {
            row.map((col, colIndex)=> {
              const tdStyle = helpers.getByPath(rowsPanelSizes, `${rowIndex}.${colIndex}`)

              return (
                <td
                    className={classnames(style.col,{[style.evenRow]:rowIndex%2===0})}
                    key={colIndex}
                    rowSpan={col.rowspan}
                    style={tdStyle}
                >
                  <div style={userDefinedSize?{width:lastRow[colIndex]}:null}>{col.displayValue}</div>
                </td>
              )
            })
          }
          </tr>
          )
        }
      </tbody>
    )
  }
}
