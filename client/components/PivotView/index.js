import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
import PivotHead from '../PivotHead'
import PivotBody from '../PivotBody'
import shallowCompare from 'react-addons-shallow-compare'
import R from 'ramda'


export default class PivotView extends Component {
  static propTypes = {
    bodyMatrix: PropTypes.array,
    headMatrix: PropTypes.array,
    loadNextPage: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      headerSizes: {

      }
    }
  }

  handleScroll(e) {
    const { loadNextPage } = this.props
    const pivotTable = e.target
    let scrollPrecent = pivotTable.scrollTop / (pivotTable.scrollHeight - pivotTable.clientHeight)

    if (scrollPrecent > 0.7) {
      loadNextPage()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentDidUpdate() {
    const { headMatrix } = this.props

    if (headMatrix) {
      const thNewSizes = this.getHeadersSizes(this.container.childNodes[0])

      if (!R.equals(this.state.headerSizes.thSizes, thNewSizes)) {

        const tableSizes = {
          width: this.container.offsetWidth,
        }

        this.setState({
          headerSizes: {
            thSizes : thNewSizes,
            tableSizes,
          },
        })
      }
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

  render() {
    const {headMatrix, bodyMatrix} = this.props
    const {headerSizes} = this.state

    return (
      <div
          className={classnames(style.container)}
          onScroll={::this.handleScroll}
      >
        <table
            className={classnames(style.stickyHeader)}
            style={headerSizes.tableSizes}
        >
            <PivotHead
                headMatrix={headMatrix}
                headerSizes={headerSizes.thSizes}
            />
        </table>
        <table className={classnames(style.pivotTable)}
            ref={container=>this.container=container}
        >
          <PivotHead
              className={classnames(style.hiddenTh)}
              headMatrix={headMatrix}
          />
          <PivotBody bodyMatrix={bodyMatrix}/>
        </table>
      </div>
    )
  }
}
