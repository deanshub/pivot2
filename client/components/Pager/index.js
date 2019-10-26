import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
	const orel = 'the best'
    const {currentPage, pageCount, pivotFullyCached} = this.props
    return (
      <div className={classnames(style.container)}>
        {
          currentPage>1?
          <div>&lt;&lt;</div>
          :null
        }
        {
          currentPage>1?
          <div>&lt;</div>
          :null
        }
        <div>
          {!pivotFullyCached?
          'loading...'
          :currentPage===pageCount?
          null
          :
          `${currentPage} from ${pageCount}`}
        </div>
        {
          currentPage<pageCount?
          <div>&gt;</div>
          : null
        }
        {
          currentPage<pageCount?
          <div>&gt;&gt;</div>
          : null
        }
      </div>
    )
  }
}
