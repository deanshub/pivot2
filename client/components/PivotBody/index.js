import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import Row from './row'

export default class PivotBody extends Component {
  static propTypes = {
    additionalStyle: PropTypes.object,
    bodyData: PropTypes.array,
    className: PropTypes.string,
    rowsPanel: PropTypes.bool,
    rowsHeaders: PropTypes.array,
    rowsPanelSizes: PropTypes.array,
    scrollTop: PropTypes.number,
    thSizes: PropTypes.array,
    sticky: PropTypes.bool,
    subTotalRows: PropTypes.array,
    userDefinedSize: PropTypes.bool,
    totalRowsNumber: PropTypes.number,
  }
  static defaultProps = {
    sticky: false,
    bodyData: [],
    rowsPanelHeaders: [],
    scrollTop: 0,
  }

  constructor(props, context) {
    super(props, context)
    this.darkRow = false
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

  negateDarkRow() {
    this.darkRow = !this.darkRow
  }

  resetDarkRow() {
    this.darkRow = false
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
      rowsPanel,
      className,
      additionalStyle,
      thSizes,
      userDefinedSize,
      totalRowsNumber,
      sticky,
      subTotalRows,
    } = this.props

    const bodyMatrix = this.consolidateBody(rowsPanelHeaders, bodyData)

    return (
      <tbody
          className={className}
          ref={container=>this.container=container}
          style={additionalStyle}
      >
        {
          bodyMatrix.map((row, rowIndex)=>{
            let darkCell = this.darkRow

            // Subtotal so skip dark row
            if (subTotalRows.indexOf(rowIndex) > -1) {
              darkCell = false
            } else {
              if (rowIndex === 0) {
                darkCell = false
                this.resetDarkRow()
              }

              this.negateDarkRow()
            }

            return (
              <Row
                  darkRow={darkCell}
                  key={rowIndex}
                  row={row}
                  rowIndex={rowIndex}
                  rowsPanel={rowsPanel}
                  rowsPanelSizes={rowsPanelSizes}
                  sticky={sticky}
                  thSizes={thSizes}
                  userDefinedSize={userDefinedSize}
              />
            )
          }
          )
        }
      </tbody>
    )
  }
}
