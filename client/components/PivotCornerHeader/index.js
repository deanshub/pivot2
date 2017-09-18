import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import style from './style.css'
import PivotThead from '../PivotThead'
import shallowCompare from 'react-addons-shallow-compare'

export default class PivotCornerHeader extends Component {
  static propTypes = {
    headerSizes: PropTypes.object,
    stickyHeaderWrapperStyle: PropTypes.object,
    rowsHeaders: PropTypes.array,
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
    const {headerSizes, stickyHeaderWrapperStyle, rowsHeaders} = this.props

    return (
      <div
          className={classnames(style.stickyHeaderWrapper)}
          style={stickyHeaderWrapperStyle}
      >
        <div className={classnames(style.stickyHeaderInnerWrapper)}>
          <table
              className={classnames(style.stickyHeaderCorner)}
              style={headerSizes.cornerSizes}
          >
              <PivotThead
                  headMatrix={[rowsHeaders]}
                  sticky
                  thSizes={headerSizes.thSizes}
              />
          </table>
        </div>
      </div>
    )
  }
}
