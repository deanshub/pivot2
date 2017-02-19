import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
import PivotView from '../../components/PivotView'
import Pager from '../../components/Pager'

export default class Pivot extends Component {
  static propTypes = {
    rowsPanelHeaders: PropTypes.array,
    bodyData: PropTypes.array,
    currentPage: PropTypes.number,
    loadNextPage: PropTypes.func,
    pageCount: PropTypes.number,
    headersData: PropTypes.object,
  }
  render() {
    const { headersData, rowsPanelHeaders, bodyData, loadNextPage, pageCount, currentPage } = this.props

    return (
      <div>
        <PivotView
            bodyData={bodyData}
            headersData={headersData}
            loadNextPage ={loadNextPage}
            rowsPanelHeaders={rowsPanelHeaders}
        />
        <Pager
            currentPage={currentPage}
            pageCount={pageCount}
        />
      </div>
    )
  }
}
