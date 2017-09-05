import React, { Component, PropTypes } from 'react'
import helpers from '../../utils/helpers.js'
import Col from './col'
import classnames from 'classnames'
import style from './style.css'

export default class PivotBodyRow extends Component {
  static propTypes = {
    darkRow: PropTypes.bool,
    negateDarkRow: PropTypes.func,
    resetDarkRow: PropTypes.func,
    rowIndex: PropTypes.number,
    rowsPanel: PropTypes.bool,
  }

  render() {
    const {
      darkRow,
      row,
      rowIndex,
      rowsPanel,
      rowsPanelSizes,
      sticky,
      userDefinedSize,
      thSizes,
    } = this.props

    return (
      <tr className={classnames(style.row)}>
      {
        row.map((col, colIndex)=> {
          const tdStyle = helpers.getByPath(rowsPanelSizes, `${rowIndex}.${colIndex}`)

          let darkCell = darkRow

          if (rowsPanel && colIndex !== row.length - 1) {
            darkCell = false
          }

          return (
            <Col
                col={col}
                colIndex={colIndex}
                darkCell={darkCell}
                key={colIndex}
                rowIndex={rowIndex}
                rowsPanel={rowsPanel}
                sticky={sticky}
                tdStyle={tdStyle}
                thSizes={thSizes}
                userDefinedSize={userDefinedSize}
            />
          )
        })
      }
      </tr>
    )
  }
}
