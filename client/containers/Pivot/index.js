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
    totalRowsNumber: PropTypes.number,
    pivotFullyCached: PropTypes.bool,
  }
  render() {
    const { headersData, rowsPanelHeaders, bodyData, loadNextPage, pageCount, currentPage, totalRowsNumber, pivotFullyCached } = this.props

    return (
      <div>
        <PivotView
            bodyData={bodyData}
            headersData={headersData}
            loadNextPage ={loadNextPage}
            rowsPanelHeaders={rowsPanelHeaders}
            totalRowsNumber={totalRowsNumber}
        />
        <Pager
            currentPage={currentPage}
            pageCount={pageCount}
            pivotFullyCached={pivotFullyCached}
        />
      </div>
    )
  }
}
