import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import classnames from 'classnames'
import style from './style.css'
import ReactDraggable from 'react-draggable'

export default class PivotTheadCol extends Component {
  static propTypes = {
    className: PropTypes.string,
    col: PropTypes.object,
    colIndex: PropTypes.number,
    resizeColumn: PropTypes.func,
    rowIndex: PropTypes.number,
    lastRow: PropTypes.bool,
    sticky: PropTypes.bool,
    thStyle: PropTypes.object,
  }
  static defaultProps = {
    thStyle: {},
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {
      col,
      colIndex,
      rowIndex,
      className,
      sticky,
      thStyle,
      lastRow,
      resizeColumn
    } = this.props

    return (
      <th
          className={className}
          colSpan={col.colspan}
          rowSpan={col.rowspan}
          style={sticky?thStyle:undefined}
      >
        <div
            className={classnames(style.titleDiv)}
        >
          {col.displayValue}
        </div>
        {
          sticky && lastRow ?
          <ReactDraggable
              axis="x"
              bounds={{left: thStyle.width!==undefined?-1*thStyle.width:undefined}}
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
  }
}
