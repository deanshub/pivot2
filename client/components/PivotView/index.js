import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
import {LEAF_CHILDREN_COUNT_SYM} from '../../constants/symbols'
import PivotHead from '../PivotHead'
import PivotBody from '../PivotBody'
import shallowCompare from 'react-addons-shallow-compare'
import R from 'ramda'


export default class PivotView extends Component {
  static propTypes = {
    bodyData: PropTypes.array,
    headersData: PropTypes.object,
    loadNextPage: PropTypes.func,
    rowsPanelHeaders: PropTypes.array,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      headerSizes: {

      },
      rowsPanelSizes: [],
      newStickyRowsStyle: {},
      stickyHeaderWrapperStyle: {},
    }
  }

  handleScroll(e) {
    const pivotTable = e.target

    if (pivotTable === this.pivotScrollWrapper) {
      const {
        scrollTop,
        scrollLeft
      } = this.state

      const newScrollTop = pivotTable.scrollTop
      const newScrollLeft = pivotTable.scrollLeft
      if (!R.equals(scrollTop, newScrollTop)) {
        this.handleVerticalScroll(pivotTable, newScrollTop)
      }

      if (!R.equals(scrollLeft, newScrollLeft)) {
        this.handleHorizontalScroll(pivotTable, newScrollLeft)
      }
    }

  }

  handleVerticalScroll(pivotTable, newScrollTop) {
    const { loadNextPage } = this.props
    let scrollPrecent = newScrollTop / (pivotTable.scrollHeight - pivotTable.clientHeight)

    if (scrollPrecent > 0.7) {
      loadNextPage()
    }

    this.setState({
      scrollTop: newScrollTop
    })
  }

  handleHorizontalScroll(pivotTable, newScrollLeft) {
    this.setState({
      scrollLeft: newScrollLeft
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentWillMount() {
    // console.log();
    window.addEventListener('resize', ()=>{this.forceUpdate()})
  }

  componentDidUpdate() {
    const { headersData, rowsPanelHeaders } = this.props

    let stateToChange = {}

    if (headersData) {
      const thNewSizes = this.getHeadersSizes(this.container.childNodes[0])

      if (!R.equals(this.state.headerSizes.thSizes, thNewSizes)) {

        const tableSizes = {
          width: this.container.offsetWidth,
        }

        const cornerSizes = this.getCornerSizes(this.container.childNodes[0], headersData.rowsHeaders.length)

        stateToChange.headerSizes = {
          thSizes : thNewSizes,
          tableSizes,
          cornerSizes,
        }
      }

      const newStickyHeaderWrapperStyle =
        this.getStickyHeaderWrapperSizes(this.stickyHeaderWrapper.parentElement, this.container.childNodes[0])

      if (!R.equals(this.state.stickyHeaderWrapperStyle, newStickyHeaderWrapperStyle)) {
        stateToChange.stickyHeaderWrapperStyle = newStickyHeaderWrapperStyle
      }
    }

    if (rowsPanelHeaders) {
      const rowsPanelNewSizes = this.getRowPanelSizes(this.container.childNodes[2])

      if (!R.equals(this.state.rowsPanelSizes, rowsPanelNewSizes)) {
        stateToChange.rowsPanelSizes = rowsPanelNewSizes
      }

      const newStickyRowsStyle = this.getStickyRowsStyles(this.container)

      if (!R.equals(this.state.stickyRowsStyle, newStickyRowsStyle)) {
        stateToChange.stickyRowsStyle = newStickyRowsStyle
      }
    }

    if (Object.keys(stateToChange).length) {
      this.setState(stateToChange)
    }
  }

  getCornerSizes(thead, numOfRowsHeaders) {
    let cornerWidth = 0

    const rowHeadersTr = thead.childNodes[0]

    for (let rowHeaderIndex = 0; rowHeaderIndex < numOfRowsHeaders; rowHeaderIndex++) {
      cornerWidth += rowHeadersTr.childNodes[rowHeaderIndex].offsetWidth
    }

    // TODO: Check how to remove
    cornerWidth += 1

    return {
      width: cornerWidth
    }
  }

  getStickyHeaderWrapperSizes(pivotContainer, thead) {
    const stickyHeaderWrapperWidth = pivotContainer.clientWidth
    // TODO: Check WTF without the + 1, there is no border at the bottom of the sticky header
    const stickyHeaderWrapperHeight = thead.clientHeight + 1

    return  {
      width: stickyHeaderWrapperWidth,
      height: stickyHeaderWrapperHeight,
    }
  }

  getHeadersSizes(thead) {
    return Array.from(thead.childNodes).map(currTr=>{
      return Array.from(currTr.childNodes).map(currTh=> {
        return {
          height: window.getComputedStyle(currTh).height,
          width: window.getComputedStyle(currTh).width,
        }
      })
    })
  }

  getRowPanelSizes(tbody) {
    return Array.from(tbody.childNodes).map(currTr=>{
      return Array.from(currTr.childNodes).filter(currTd=>currTd.rowSpan).map(currTd=> {
        return {
          height: window.getComputedStyle(currTd).height,
          width: window.getComputedStyle(currTd).width,
        }
      })
    })
  }

  getStickyRowsStyles(table) {
    const pivotContainerHeight = window.getComputedStyle(table.parentElement).height
    const theadHeight = window.getComputedStyle(table.childNodes[0]).height
    const stickyRowsHeight = parseInt(pivotContainerHeight) - parseInt(theadHeight)

    return {
      height: stickyRowsHeight,
    }
  }

  consolidateHeads(rowsHeaders, colsHeaders, dataHeaders, hierarchies){
    const rowsExists = hierarchies.hierarchyRows.length>0
    const colsExists = hierarchies.hierarchyCols.length>0
    const dataExists = hierarchies.hierarchyData.length>1

    let headerMatrix = []
    let dataCellsAmountToAdd



    if (!rowsExists && !colsExists && !dataExists){
      // TODO: take care of 1 data
      headerMatrix = [[]]
      dataCellsAmountToAdd = dataHeaders.length
    }else if(colsExists && dataExists){
      // hierarchyCols.length + 1
      headerMatrix = Array.from(Array(colsHeaders.length + 1)).map(()=> {
        return []
      })

      dataCellsAmountToAdd = colsHeaders[colsHeaders.length - 1].length
    }else if(rowsExists && !colsExists && !dataExists){
      headerMatrix = [[]]
      dataCellsAmountToAdd = dataHeaders.length
      // 1
    }else if(colsExists || dataExists){
      if (dataExists) {
        headerMatrix = [[]]
        dataCellsAmountToAdd = 1
      } else {
        headerMatrix = Array.from(Array(colsHeaders.length)).map(()=> {
          return []
        })

        dataCellsAmountToAdd = colsHeaders[colsHeaders.length - 1].length
      }
      // hierarchyCols.length || 1
    }

    headerMatrix[0] = headerMatrix[0].concat(rowsHeaders)

    colsHeaders.forEach((currRow, index) => {
      headerMatrix[index] = headerMatrix[index].concat(currRow)
    })

    for (let index = 0; index < dataCellsAmountToAdd; index++) {
      headerMatrix[headerMatrix.length-1] = headerMatrix[headerMatrix.length-1].concat(dataHeaders)
    }

    return headerMatrix
  }

  render() {
    const {headersData, rowsPanelHeaders, bodyData} = this.props

    const {
      headerSizes,
      rowsPanelSizes,
      scrollLeft,
      scrollTop,
      stickyRowsStyle,
      stickyHeaderWrapperStyle,
    } = this.state

    let headMatrix = []
    let rowsHeaders = []

    if (headersData) {
      const {colsHeaders, dataHeaders, hierarchies} = headersData
      rowsHeaders = headersData.rowsHeaders
      headMatrix = this.consolidateHeads(rowsHeaders, colsHeaders, dataHeaders, hierarchies)
    }

    return (
      <div
          className={classnames(style.container)}
          onScroll={::this.handleScroll}
          ref={pivotScrollWrapper=>this.pivotScrollWrapper=pivotScrollWrapper}
      >
        <div
            className={classnames(style.stickyHeaderWrapper)}
            style={stickyHeaderWrapperStyle}
        >
          <div className={classnames(style.stickyHeaderInnerWrapper)}>
            <table
                className={classnames(style.stickyHeaderCorner)}
                style={headerSizes.cornerSizes}
            >
                <PivotHead
                    headMatrix={[rowsHeaders]}
                    headerSizes={headerSizes.thSizes}
                />
            </table>
          </div>
        </div>
        <div
            className={classnames(style.stickyHeaderWrapper)}
            ref={stickyHeaderWrapper=>this.stickyHeaderWrapper=stickyHeaderWrapper}
            style={stickyHeaderWrapperStyle}
        >
          <div className={classnames(style.stickyHeaderInnerWrapper)}>
            <table
                className={classnames(style.stickyHeader)}
                style={headerSizes.tableSizes}
            >
                <PivotHead
                    headMatrix={headMatrix}
                    headerSizes={headerSizes.thSizes}
                    scrollLeft={scrollLeft}
                />
            </table>
          </div>
        </div>
        <table className={classnames(style.pivotTable)}
            ref={container=>this.container=container}
        >
          <PivotHead
              className={classnames(style.hiddenThead)}
              headMatrix={headMatrix}
          />
          <PivotBody
              additionalStyle={stickyRowsStyle}
              className={classnames(style.stickyRowsPanel)}
              rowsPanelHeaders={rowsPanelHeaders}
              rowsPanelSizes={rowsPanelSizes}
              scrollTop={scrollTop}
          />
          <PivotBody
              bodyData={bodyData}
              rowsPanelHeaders={rowsPanelHeaders}
          />
        </table>
      </div>
    )
  }
}
