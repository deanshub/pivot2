import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import Row from './row'

export default class PivotBody extends Component {
  static propTypes = {
    additionalStyle: PropTypes.object,
    bodyData: PropTypes.array,
    className: PropTypes.string,
    rowsHeaders: PropTypes.array,
    rowsPanelSizes: PropTypes.array,
    scrollTop: PropTypes.number,
    thSizes: PropTypes.array,
    sticky: PropTypes.bool,
    userDefinedSize: PropTypes.bool,
  }
  static defaultProps = {
    sticky: false,
    bodyData: [],
    rowsPanelHeaders: [],
    scrollTop: 0,
  }

  componentDidMount(){
    this.updateScrollPosition()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentDidUpdate() {
    this.updateScrollPosition()
  }


  updateScrollPosition(){
    const {scrollTop, sticky} = this.props

    if (sticky && scrollTop !== undefined) {
      this.container.scrollTop = scrollTop
    }
  }

  consolidateBody(bodyDataRowsHeaders, bodyData){
    if (bodyDataRowsHeaders.length === 0) {
      return bodyData
    }

    return bodyDataRowsHeaders.map((row, index)=>{
      return row.concat(bodyData[index] || [])
    })
  }

  render() {
    const {
      rowsPanelHeaders,
      bodyData,
      rowsPanelSizes,
      className,
      additionalStyle,
      thSizes,
      userDefinedSize,
      sticky,
    } = this.props

    const bodyMatrix = this.consolidateBody(rowsPanelHeaders, bodyData)

    return (
      <tbody
          className={className}
          ref={container=>this.container=container}
          style={additionalStyle}
      >
        {
          bodyMatrix.map((row, rowIndex)=>
            <Row
                key={rowIndex}
                row={row}
                rowIndex={rowIndex}
                rowsPanelSizes={rowsPanelSizes}
                thSizes={thSizes}
                userDefinedSize={userDefinedSize}
            />
          )
        }
      </tbody>
    )
  }
}
