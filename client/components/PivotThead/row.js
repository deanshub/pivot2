import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import helpers from '../../utils/helpers.js'
import classnames from 'classnames'
import style from './style.css'
import Col from './col'

export default class PivotTheadRow extends Component {
  static propTypes = {
    firstRow: PropTypes.bool,
    lastRow: PropTypes.bool,
    rowIndex: PropTypes.number,
    sticky: PropTypes.bool,
  }
  // static defaultProps = {
  // }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {
      lastRow,
      row,
      rowIndex,
      sticky,
      thSizes,
      resizeColumn,
    } = this.props


    return (
      <tr>
      {

        row.map((col, colIndex)=> {
          const thStyle = helpers.getByPath(thSizes, `${rowIndex}.${colIndex}`)

          return (
            <Col
                className={classnames(style.th)}
                col={col}
                colIndex={colIndex}
                key={colIndex}
                lastRow={lastRow}
                resizeColumn={resizeColumn}
                rowIndex={rowIndex}
                sticky={sticky}
                thStyle={thStyle}
            />
          )
        })
      }
      </tr>
    )
  }
}
