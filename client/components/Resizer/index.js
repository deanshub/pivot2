import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import classnames from 'classnames'
import style from './style.css'
import ReactDraggable from 'react-draggable'

export default class Resizer extends Component {
  static propTypes = {
    headerSizes: PropTypes.object,
    resizeColumnHandler: PropTypes.func,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {headerSizes, resizeColumnHandler} = this.props
    // console.log(headerSizes);
    const headerSizesAccumulated = headerSizes.thSizes.reduce((res,curRow, rowIndex)=>{
      let rowSize = 0
      const rowSizes = curRow.map((colSize, colIndex)=>{
        const rowPosition = rowSize + parseInt(colSize.width.slice(0,-2))
        rowSize=rowPosition+3
        return {rowIndex, colIndex, size:rowPosition}
      })
      return res.concat(rowSizes)
    },[])
    console.log(headerSizesAccumulated);

    return (
      <div>
        {
          headerSizesAccumulated.map((col, colIndex)=>{
            return (
              <div
                  className={classnames(style.resizeColContainer)}
                  key={colIndex}
                  style={{left:col.size}}
              >
                <ReactDraggable
                    axis="x"
                    bounds={{left: -100, right: 100}}
                    onStop={(e,{x,y})=>{resizeColumnHandler(col.rowIndex, col.colIndex, x, y)}}
                >
                  <div
                      className={classnames(style.resizer)}
                  />
                </ReactDraggable>
              </div>
            )
          })
        }
      </div>
    )
  }
}
