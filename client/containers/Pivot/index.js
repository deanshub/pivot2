import React, { Component, PropTypes } from 'react'
// import Sisense, {Widget} from '../../components/Sisense'
import PivotView from '../../components/PivotView'
import Pager from '../../components/Pager'

export default class Pivot extends Component {
  static propTypes = {
    bodyMatrix: PropTypes.array,
    currentPage: PropTypes.number,
    loadNextPage: PropTypes.func,
    pageCount: PropTypes.number,
    headMatrix: PropTypes.array,
  }
  render() {
    const { headMatrix, bodyMatrix, loadNextPage, pageCount, currentPage } = this.props

    return (
      <div>
        <PivotView
            bodyMatrix={bodyMatrix}
            headMatrix={headMatrix}
            loadNextPage ={loadNextPage}
        />
        <Pager
            currentPage={currentPage}
            pageCount={pageCount}
        />
      </div>
    )
  }
}
