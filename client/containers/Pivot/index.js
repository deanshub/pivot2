import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PivotView from '../../components/PivotView'
import Pager from '../../components/Pager'

export default class Pivot extends Component {
  static propTypes = {
    bodyData: PropTypes.array,
    currentPage: PropTypes.number,
    loadNextPage: PropTypes.func,
    pageCount: PropTypes.number,
    pivotFullyCached: PropTypes.bool,
    headersData: PropTypes.object,
    rowsPanelHeaders: PropTypes.array,
    totalRowsNumber: PropTypes.number,
    subTotalRows: PropTypes.array,
  }

  constructor(props){
    super(props)
    this.state = props
  }

  componentWillReceiveProps(props){
    this.setState(props)
  }

  render() {
    const {
      headersData,
      rowsPanelHeaders,
      bodyData,
      loadNextPage,
      pageCount,
      currentPage,
      subTotalRows,
      totalRowsNumber,
      pivotFullyCached,
    } = this.state

    return (
      <div>
        <PivotView
            bodyData={bodyData}
            headersData={headersData}
            loadNextPage ={loadNextPage}
            pivotFullyCached={pivotFullyCached}
            rowsPanelHeaders={rowsPanelHeaders}
            subTotalRows={subTotalRows}
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
