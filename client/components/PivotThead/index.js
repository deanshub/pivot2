import React, { Component } from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import Row from './row'

export default class PivotThead extends Component {
  static propTypes = {
    className: PropTypes.string,
    headMatrix: PropTypes.array,
    resizeColumn: PropTypes.func,
    scrollLeft: PropTypes.number,
    sticky: PropTypes.bool,
    thSizes: PropTypes.array,
    rowsHeaders: PropTypes.array,
  }
  static defaultProps = {
    headMatrix: [],
    rowsHeaders: [],
  }

  componentDidMount(){
    this.updateScrollPosition()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentDidUpdate() {
    this.updateScrollPosition()
  }

  updateScrollPosition(){
    const {scrollLeft} = this.props

    if (scrollLeft !== undefined) {
      this.container.parentElement.style.left = `${(-1)*scrollLeft}px`
    }
  }

  render() {
    const {headMatrix, thSizes, className, sticky, resizeColumn} = this.props

    return (
      <thead
          className={className}
          ref={container=>this.container=container}
      >
        {
          headMatrix.map((row, rowIndex, rows)=>
            <Row
                firstRow={rowIndex===0}
                key={rowIndex}
                lastRow={rowIndex===rows.length-1}
                resizeColumn={resizeColumn}
                row={row}
                rowIndex={rowIndex}
                sticky={sticky}
                thSizes={thSizes}
            />
          )
      }
      </thead>
    )
  }
}
