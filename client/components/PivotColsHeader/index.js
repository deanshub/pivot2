import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
import PivotThead from '../PivotThead'
import shallowCompare from 'react-addons-shallow-compare'

export default class PivotColsHeader extends Component {
  static propTypes = {
    headMatrix: PropTypes.array,
    headerSizes: PropTypes.object,
    resizeColumn: PropTypes.func,
    stickyHeaderWrapperStyle: PropTypes.object,
    scrollLeft: PropTypes.number,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {
      headMatrix,
      headerSizes,
      stickyHeaderWrapperStyle,
      scrollLeft,
      resizeColumn,
    } = this.props

    return (
      <div
          className={classnames(style.stickyHeaderWrapper)}
          ref={stickyHeaderWrapper=>this.stickyHeaderWrapper=stickyHeaderWrapper}
          style={stickyHeaderWrapperStyle}
      >
        <div className={classnames(style.stickyHeaderInnerWrapper)}>
          <table
              className={classnames(style.stickyHeader)}
              style={headerSizes.tableSizes}
          >
              <PivotThead
                  headMatrix={headMatrix}
                  headerSizes={headerSizes.thSizes}
                  resizeColumn={resizeColumn}
                  scrollLeft={scrollLeft}
                  sticky
              />
          </table>
        </div>
      </div>
    )
  }
}
