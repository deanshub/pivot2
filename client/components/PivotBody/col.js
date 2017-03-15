import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class PivotBodyCol extends Component {
  static propTypes = {
    col: PropTypes.object,
    colIndex: PropTypes.number,
    rowIndex: PropTypes.number,
    tdStyle: PropTypes.object,
    userDefinedSize: PropTypes.bool,
  }

  render() {
    const { col, tdStyle, rowIndex, colIndex, userDefinedSize, thSizes } = this.props
    const lastRow = userDefinedSize?thSizes[thSizes.length-1]:[]
    const colStyle = userDefinedSize&&lastRow[colIndex-thSizes.rowsHeaders.length]?
      {width:lastRow[colIndex-thSizes.rowsHeaders.length].width}
      :
      undefined

    return (
      <td
          className={classnames(style.col,{[style.evenRow]:rowIndex%2===0})}
          rowSpan={col.rowspan}
          style={tdStyle}
      >
        <div style={colStyle}>{col.displayValue}</div>
      </td>
    )
  }
}
