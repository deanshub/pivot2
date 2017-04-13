import React, { Component, PropTypes } from 'react'
import helpers from '../../utils/helpers.js'
import Col from './col'
import classnames from 'classnames'
import style from './style.css'

export default class PivotBodyRow extends Component {
  static propTypes = {
    rowIndex: PropTypes.number,
  }

  render() {
    const { row, rowIndex, rowsPanelSizes, userDefinedSize, thSizes } = this.props

    return (
      <tr className={classnames(style.row)}>
      {
        row.map((col, colIndex)=> {
          const tdStyle = helpers.getByPath(rowsPanelSizes, `${rowIndex}.${colIndex}`)

          return (
            <Col
                col={col}
                colIndex={colIndex}
                key={colIndex}
                rowIndex={rowIndex}
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
