import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import classnames from 'classnames'
import style from './style.css'

export default class PivotBody extends Component {
  static propTypes = {
    bodyMatrix: PropTypes.array,
  }
  static defaultProps = {
    bodyMatrix: [],
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {bodyMatrix}=this.props
    return (
      <tbody>
        {bodyMatrix.map((row, rowIndex)=>
          <tr key={rowIndex}>{row.map((col, colIndex)=>
            <td
                className={classnames(style.col,{[style.evenRow]:rowIndex%2===0})}
                key={colIndex}
                rowSpan={col.rowspan}
            >
              {col.displayValue}
            </td>
          )}
          </tr>)}
      </tbody>
    )
  }
}
