import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class Pivot extends Component {
  static propTypes = {
    data: PropTypes.object,
  }
  // static defaultProps = {
  // }

  // componentDidMount(){
  // }
  getCol(col, index){
    return (
      <td key={index}>
        {col.text}
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

  render() {
    const {data} = this.props
console.log(data);
    return (
      <table
          className={classnames(style.container)}
          ref={container=>this.container=container}
      >
        <thead>
          <tr>{data.headers.map(header=><th key={header}>{header}</th>)}</tr>
        </thead>
        <tbody>
          {data.values.map(::this.getRow)}
        </tbody>
      </table>
    )
  }
}
