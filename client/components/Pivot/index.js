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
        <td>{index+1}</td>
        {row.map(::this.getCol)}
      </tr>
    )
  }

  getHeaders(hirarchy){
    return [{name:'Row'},...hirarchy].map(header=><th className={classnames(style.pivotHeaders)} key={header.name}>{header.name}</th>)
  }

  render() {
    const {data, hirarchy} = this.props

    return (
      <div
          className={classnames(style.container)}>
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
