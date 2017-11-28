import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import style from './style.css'
import helpers from '../../utils/helpers'

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

    let backgroundColor
    
    if (col && col.format && col.format.color) {
      backgroundColor = helpers.calculateColor(col.dataValue, col.format.color)
    }

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
          style={{
            backgroundColor: backgroundColor || undefined,
          }}
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
