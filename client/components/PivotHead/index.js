import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import helpers from '../../Utils/helpers.js'
import classnames from 'classnames'
import style from './style.css'


export default class PivotHead extends Component {
  static propTypes = {
    className: PropTypes.string,
    headMatrix: PropTypes.array,
    scrollLeft: PropTypes.number,
  }
  static defaultProps = {
    headMatrix: [],
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentDidUpdate() {
    const {scrollLeft} = this.props

    if (scrollLeft !== undefined) {
      this.container.parentElement.style.left = (-1)*scrollLeft + 'px'
    }
  }

  render() {
    const {headMatrix, headerSizes, className} = this.props

    return (
      <thead className={className} ref={container=>this.container=container}>
        {
          headMatrix.map((row, rowIndex)=>
            <tr key={rowIndex}>
            {
              row.map((col, colIndex)=> {
                const thStyle = helpers.getByPath(headerSizes, `${rowIndex}.${colIndex}`)

                return (
                  <th
                    colSpan={col.colspan}
                    key={colIndex}
                    rowSpan={col.rowspan}
                    className={classnames(style.th)}
                    style={thStyle}
                  >
                    {col.displayValue}
                  </th>
                )
              })
            }
            </tr>
          )
      }
      </thead>
    )
  }
}
