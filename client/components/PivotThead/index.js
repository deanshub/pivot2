import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import helpers from '../../Utils/helpers.js'
import classnames from 'classnames'
import style from './style.css'
import ReactDraggable from 'react-draggable'

export default class PivotThead extends Component {
  static propTypes = {
    className: PropTypes.string,
    headMatrix: PropTypes.array,
    resizeColumn: PropTypes.func,
    scrollLeft: PropTypes.number,
    sticky: PropTypes.bool,
    headerSizes: PropTypes.array,
    rowsHeaders: PropTypes.array,
  }
  static defaultProps = {
    headMatrix: [],
    rowsHeaders: [],
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentDidUpdate() {
    const {scrollLeft} = this.props

    if (scrollLeft !== undefined) {
      this.container.parentElement.style.left = `${(-1)*scrollLeft}px`
    }
  }

  render() {
    const {headMatrix, headerSizes, className, sticky, resizeColumn, rowsHeaders} = this.props

    return (
      <thead
          className={className}
          ref={container=>this.container=container}
      >
        {
          headMatrix.map((row, rowIndex, rows)=>
            <tr key={rowIndex}>
            {
              row.map((col, colIndex)=> {
                const thStyle = rowIndex===rows.length-1 || (rowIndex===0 && colIndex<rowsHeaders.length) ?
                  helpers.getByPath(headerSizes, `${rowIndex}.${colIndex}`)
                  :
                  {}

                return (
                  <th
                      className={classnames(style.th)}
                      colSpan={col.colspan}
                      key={colIndex}
                      rowSpan={col.rowspan}
                  >
                    <div
                        className={classnames(style.titleDiv)}
                        style={thStyle}
                    >
                      {col.displayValue}
                    </div>
                    {
                      sticky && rowIndex===rows.length-1 ?
                      <ReactDraggable
                          axis="x"
                          bounds={{left: thStyle?-1*thStyle.width:undefined}}
                          onStop={(e,{x,y})=>{resizeColumn(rowIndex, colIndex, x, y)}}
                          position={{x:0,y:0}}
                      >
                        <div className={classnames(style.resizeContainer)}>
                          {/* <div className={classnames(style.resizeVisual)}/> */}
                        </div>
                      </ReactDraggable>
                      :
                      null
                    }
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
