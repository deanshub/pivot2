import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class Pager extends Component {
  static propTypes = {
    currentPage: PropTypes.number,
    pageCount: PropTypes.number,
    pivotFullyCached: PropTypes.bool,
  }
  static defaultProps = {
    currentPage:1,
  }

  render(){
    const {currentPage, pageCount, pivotFullyCached} = this.props
    return (
      <div className={classnames(style.container)}>
        <div>&lt;&lt;</div>
        <div>&lt;</div>
        <div>{currentPage} from {pageCount}</div>
        <div>&gt;</div>
        {
          pivotFullyCached ?
          <div>&gt;&gt;</div>
          : null
        }
      </div>
    )
  }
}
