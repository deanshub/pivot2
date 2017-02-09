import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
// import Sisense, {Widget} from '../../components/Sisense'
import PivotView from '../../components/PivotView'
import Pager from '../../components/Pager'
import QueryPanel from '../../components/QueryPanel'
import style from './style.css'
import TransformerWorker from '../../store/transformer.webworker'
const transformer = new TransformerWorker()
import PanelWorker from '../../components/QueryPanel/panel.webworker'

class App extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
    }

    this.loadingNextPage = false
    this.streamStopped = false

    this.streamMetaData={
      pageNumber:1,
    }
  }

  componentDidMount(){
    this.panelWorker = new PanelWorker()
    this.panelWorker.addEventListener('message', ::this.handleWebworkerMessage)
  }

  handleWebworkerMessage({data}){
    const { type, ...restData } = data
    if (type==='startQuery'){
      this.startQuery(restData)
    }else if (type==='onChunks' && !this.streamStopped){
      this.onChunks(restData.bodyMatrix, restData.headMatrix, restData.end)
    } else if (type === 'totalRowsNumber') {
      this.getTotalRowsNumber(restData.totalRowsNumber)
    }
  }

  startQuery(data) {
    const {
      baseUrl,
      fullToken,
      parsedJaql,
      datasource,
      hierarchy,
    } = data

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

  onChunks(bodyMatrix, headMatrix, end){
    this.setState({
      bodyMatrix,
      headMatrix,
    })

    this.loadingNextPage = false
  }

  getTotalRowsNumber(totalRowsNumber) {
    totalRowsNumber = parseInt(totalRowsNumber)
    this.setState({
      totalRowsNumber,
    })
  }

  getWholeResults(results) {
    transformer.postMessage(results)
    transformer.addEventListener('message',(e)=>{
      this.setState({
        data: e.data,
      })
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
    this.resetPivotData()
    this.panelWorker.postMessage({type:'prepareQueryArgs' ,token, jaql, url, chunksLimit, pageSize, pageNumber})
  }

  stopStream() {
    this.streamStopped = true
    this.panelWorker.postMessage({
      type:'cancelStream',
    })
  }

  resetPivotData() {
    this.setState({
      hierarchy: [],
      data: [],
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

  render() {
    const { headMatrix, bodyMatrix, totalRowsNumber } = this.state

    let pageCount = 0

    if (totalRowsNumber) {
      pageCount = Math.ceil(totalRowsNumber / this.streamMetaData.pageSize)
    }

    return (
      <div
          className={classnames(style.container)}
      >
        <QueryPanel
            getWholeResults={::this.getWholeResults}
            onChunks={::this.onChunks}
            resetPivotData={::this.resetPivotData}
            startStream={::this.startStream}
            stopStream={::this.stopStream}
        />
        <PivotView
            bodyMatrix={bodyMatrix}
            headMatrix={headMatrix}
            loadNextPage ={::this.loadNextPage}
        />
        <Pager
            currentPage={this.streamMetaData.pageNumber}
            pageCount={pageCount}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    board: state.board,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // actions: bindActionCreators(BoardActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
