import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'


export default class PivotHead extends Component {
  static propTypes = {
    headMatrix: PropTypes.array,
  }
  static defaultProps = {
    headMatrix: [],
  }

  render() {
    const {headMatrix} = this.props

    return (
      <thead>
        {headMatrix.map((row, rowIndex)=>
          <tr key={rowIndex}>{row.map((col, colIndex)=>
            <th
                colSpan={col.colspan}
                key={colIndex}
                rowSpan={col.rowspan}
                className={classnames(style.th)}
            >
              {col.displayValue}
            </th>)}
          </tr>)}
      </thead>
    )
  }
}
