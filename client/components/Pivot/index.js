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
    // console.log(col);
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
    return hirarchy.map(header=><th key={header.name}>{header.name}</th>)
  }

  render() {
    const {data, hirarchy} = this.props

    return (
      <table
          className={classnames(style.container)}
          ref={container=>this.container=container}
      >
        <thead>
          <tr>{this.getHeaders(hirarchy)}</tr>
        </thead>
        <tbody>
          {data.map(::this.getRow)}
        </tbody>
      </table>
    )
  }
}
