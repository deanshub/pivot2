import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
// import Sisense, {Widget} from '../../components/Sisense'
import PivotView from '../../components/PivotView'
import Pager from '../../components/Pager'
import QueryPanel from '../../components/QueryPanel'
import style from './style.css'
// import * as BoardActions from '../../ducks/board'

// import mockData from '../../store/data.mock'
import TransformerWorker from '../../store/transformer.webworker'
const transformer = new TransformerWorker()
import * as generator from '../../store/generator'
import PanelWorker from '../../components/QueryPanel/panel.webworker'

const generatedDataHirarchy = [{
  name:'date',
  type:'row',
},{
  name:'id',
  type:'row',
},{
  name:'region',
  type:'col',
},{
  name:'country',
  type:'col',
},{
  name:'city',
  type:'col',
},{
  name:'amount',
  type:'value',
}]

const generatedData = generator.generate([{
  name: 'date',
  type: 'date',
  amount: 600,
},{
  name: 'id',
  type: 'integer',
  min: 1,
  max: 9999999999999,
},{
  name: 'region',
  type: 'string',
  amount: 50,
  length: 15,
},{
  name: 'country',
  type: 'string',
  amount: 200,
  length: 30,
},{
  name: 'city',
  type: 'string',
  amount: 400,
  length: 20,
},{
  name: 'amount',
  type: 'integer',
  min: 100,
  max: 1000000,
}], 1000)

const convertedGeneratedData = generatedData.map(row=>{
  let newRow = []
  for(let prop in row){
    newRow.push(row[prop])
  }
  return newRow
})

class App extends Component {
  constructor(props, context) {
    super(props, context)

    this.panelWorker = new PanelWorker()
    this.panelWorker.addEventListener('message', ::this.handleWebworkerMessage)

    this.state = {
      hierarchy:generatedDataHirarchy,
      data:convertedGeneratedData,
    }

    this.loadingNextPage = false
    this.streamStopped = false

    this.streamMetaData={
      pageNumber:1,
    }
  }

  handleWebworkerMessage({data}){
    const { type, ...restData } = data
    if (type==='startQuery'){
      this.startQuery(restData)
    }else if (type==='onChunks' && !this.streamStopped){
      this.onChunks(restData.pivotData, restData.headersData, restData.end)
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

  onChunks(chunks, headersData, end){
    const { data } = this.state

    this.setState({
      data: [...data , ...chunks],
      headersData,
    })

    this.loadingNextPage = false
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
    const { data, headersData, hierarchy } = this.state

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
            data={data}
            headersData={headersData}
            hierarchy={hierarchy}
            loadNextPage ={::this.loadNextPage}
        />
        <Pager
          currentPage={this.streamMetaData.pageNumber}
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
