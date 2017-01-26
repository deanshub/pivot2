import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
import PivotHead from '../PivotHead'
import PivotBody from '../PivotBody'


export default class PivotView extends Component {
  static propTypes = {
    data: PropTypes.array,
    hierarchy: PropTypes.array,
    headersData: PropTypes.object,
  }
  // static defaultProps = {
  // }

  // componentDidMount(){
  // }

  handleScroll(e) {
    const { loadNextPage } = this.props
    const pivotTable = e.target
    let scrollPrecent = pivotTable.scrollTop / (pivotTable.scrollHeight - pivotTable.clientHeight)

    if (scrollPrecent > 0.7) {
      loadNextPage()
    }
  }

  render() {
    const {data, headersData, hierarchy} = this.props

    return (
      <div
          className={classnames(style.container)}
          onScroll={::this.handleScroll}
      >
        <table className={classnames(style.pivotTable)}
            ref={container=>this.container=container}
        >
          <PivotHead headersData={headersData} hierarchy={hierarchy} />
          <PivotBody headersData={headersData} hierarchy={hierarchy}/>
        </table>
      </div>
    )
  }
}
