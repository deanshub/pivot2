import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class Pivot extends Component {
  static propTypes = {
    data: PropTypes.array,
    hirarchy: PropTypes.array,
  }
  // static defaultProps = {
  // }

  // componentDidMount(){
  // }

  getCol(col, index){
    return (
      <td key={index}>
        {col.text!==undefined?col.text:col.toString()}
      </td>
    )
  }

  getRow(row, index){
    return (
      <tr key={index}>
        {row.map(::this.getCol)}
      </tr>
    )
  }

  getHeaders(hirarchy){
    console.log(hirarchy);
    return hirarchy.map(header=><th className={classnames(style.pivotHeaders)} key={header.name}>{header.name}</th>)
  }

  handleScroll(e) {
    const { loadNextPage } = this.props
    const pivotTable = e.target
    let scrollPrecent = pivotTable.scrollTop / (pivotTable.scrollHeight - pivotTable.clientHeight)

    if (scrollPrecent > 0.7) {
      loadNextPage()
    }
  }

  render() {
    const {data, hirarchy} = this.props

    return (
      <div
          className={classnames(style.container)} onScroll={::this.handleScroll}>
        <table className={classnames(style.pivotTable)}
            ref={container=>this.container=container}
        >
          <thead>
            <tr>{this.getHeaders(hirarchy)}</tr>
          </thead>
          <tbody>
            {data.map(::this.getRow)}
          </tbody>
        </table>
      </div>
    )
  }
}
