import React, { Component } from 'react'
import classnames from 'classnames'
import Pivot from '../Pivot'
import QueryPanel from '../../components/QueryPanel'
import style from './style.css'
import PanelWorker from '../../components/QueryPanel/panel.webworker'

export default class App extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      hierarchy: undefined,
      data: [],
      headersData: undefined,
      rowsPanelHeaders: [],
      bodyData: undefined,
      totalPagesCached: undefined,
      totalRowsNumber: undefined,
      pivotFullyCached:true,
    }

    this.panelWorker = new PanelWorker()
    this.loadingNextPage = false
    this.streamStopped = false

    this.streamMetaData={
      pageNumber:1,
    }
  }

  componentDidMount(){
    this.panelWorker.addEventListener('message', ::this.handleWebworkerMessage)
  }

  handleWebworkerMessage({data}){
    const { type, ...restData } = data
    if (type === 'startQuery'){
      this.startQuery(restData)
    } else if (type === 'onChunks' && !this.streamStopped){
      this.onChunks(restData.headersData, restData.rowsPanelHeaders, restData.bodyData, restData.end)
    } else if (type === 'totalPagesCached') {
      this.setPagesCount(restData.totalPagesCached)
    } else if (type === 'totalRowsNumber') {
      this.setTotalRowsNumber(restData.totalRowsNumber)
    } else if (type === 'pivotFullyCached') {
      this.setPivotFullyCached(restData.pivotFullyCached)
    }
  }

  startQuery(queryData) {
    const {
      baseUrl,
      fullToken,
      parsedJaql,
      datasource,
      hierarchy,
    } = queryData

    this.setState({
      hierarchy,
    })

    this.panelWorker.postMessage({
      type:'startStreamRequest',
      baseUrl,
      fullToken,
      parsedJaql,
      datasource,
      hierarchy,
    })
  }

  setTotalRowsNumber(totalRowsNumber) {
    this.setState({
      totalRowsNumber,
    })
  }

  onChunks(headersData, rowsPanelHeaders, bodyData, end){
    this.setState({
      rowsPanelHeaders,
      bodyData,
      headersData,
    })

    this.loadingNextPage = false
  }

  setPagesCount(totalPagesCached) {
    this.setState({
      totalPagesCached,
    })
  }

  setPivotFullyCached(pivotFullyCached) {
    this.setState({
      pivotFullyCached,
    })
  }

  startStream(token, jaql, url, chunksLimit, pageSize, pageNumber) {
    if (!Number.isInteger(pageNumber)) {
      pageNumber = parseInt(pageNumber)
    }

    this.streamMetaData = {
      token,
      jaql,
      url,
      chunksLimit,
      pageSize,
      pageNumber,
    }

    this.streamStopped = false
    this.resetPivotData({pivotFullyCached:false})
    this.panelWorker.postMessage({type:'prepareQueryArgs' ,token, jaql, url, chunksLimit, pageSize, pageNumber})
  }

  stopStream() {
    this.streamStopped = true
    this.panelWorker.postMessage({
      type:'cancelStream',
    })
  }

  resetPivotData(extra) {
    this.setState({
      hierarchy: undefined,
      data: [],
      headersData: undefined,
      rowsPanelHeaders: [],
      bodyData: undefined,
      totalPagesCached: undefined,
      totalRowsNumber: undefined,
      pivotFullyCached:true,
      ...extra,
    })
  }

  loadNextPage() {
    if (!this.loadingNextPage && !this.streamStopped) {
      this.loadingNextPage = true

      const {
        token,
        jaql,
        url,
        chunksLimit,
        pageSize,
        pageNumber,
      } = this.streamMetaData

      this.streamMetaData.pageNumber += 1

      this.panelWorker.postMessage({type:'prepareQueryArgs' ,token, jaql, url, chunksLimit, pageSize, pageNumber: pageNumber + 1})
    }
  }

  componentWillUnmount(){
    this.panelWorker.close()
    this.stopStream()
  }

  render() {
    const { headersData, rowsPanelHeaders, bodyData, totalPagesCached, totalRowsNumber, pivotFullyCached} = this.state

    return (
      <div
          className={classnames(style.container)}
      >
        <QueryPanel
            onChunks={::this.onChunks}
            resetPivotData={::this.resetPivotData}
            startStream={::this.startStream}
            stopStream={::this.stopStream}
        />
        <Pivot
            bodyData={bodyData}
            currentPage={this.streamMetaData.pageNumber}
            headersData={headersData}
            loadNextPage ={::this.loadNextPage}
            pageCount={totalPagesCached}
            pivotFullyCached={pivotFullyCached}
            rowsPanelHeaders={rowsPanelHeaders}
            totalRowsNumber={totalRowsNumber}
        />
      </div>
    )
  }
}
