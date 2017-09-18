import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import style from './style.css'

export default class PivotBodyCol extends Component {
  static propTypes = {
    col: PropTypes.object,
    colsNum: PropTypes.number,
    colIndex: PropTypes.number,
    darkCell: PropTypes.bool,
    rowIndex: PropTypes.number,
    rowsPanel: PropTypes.bool,
    tdStyle: PropTypes.object,
    userDefinedSize: PropTypes.bool,
  }

  render() {
    const {
      col,
      tdStyle,
      rowIndex,
      colIndex,
      userDefinedSize,
      thSizes,
      rowsPanel,
      darkCell,
      sticky
    } = this.props
    const lastRow = userDefinedSize?thSizes[thSizes.length-1]:[]
    const colStyle = userDefinedSize&&lastRow[colIndex-thSizes.rowsHeaders.length]?
      {width:lastRow[colIndex-thSizes.rowsHeaders.length].width}
      :
      undefined

    return (
      <td
          className={
            classnames(
              style.col,
              {[style.regularColumn]: !sticky},
              {[style.stickyColumn]: sticky},
              {[style.evenRow]: darkCell},
            )
          }
          colSpan={col.colspan}
          rowSpan={col.rowspan}
      >
        <div
            dir="auto"
            style={{
              display:'inline-block',
              ...tdStyle,
              ...colStyle,
            }}
        >
          {col.displayValue}
        </div>
      </td>
    )
  }
}
