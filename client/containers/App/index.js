import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
// import Sisense, {Widget} from '../../components/Sisense'
import Pivot from '../../components/Pivot'
import QueryPanel from '../../components/QueryPanel'
import style from './style.css'
// import * as BoardActions from '../../ducks/board'

// import mockData from '../../store/data.mock'
import TransformerWorker from '../../store/transformer.webworker'
const transformer = new TransformerWorker()
import * as generator from '../../store/generator'


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

    this.state = {
      pivotData : {
        hirarchy:generatedDataHirarchy,
        data:convertedGeneratedData,
      },
    }
  }

  getResults(results) {
    transformer.postMessage(results)
    transformer.addEventListener('message',(e)=>{
      this.setState({
        pivotData: e.data,
      })
    })
  }

  render() {
    const { pivotData } = this.state

    return (
      <div
          className={classnames(style.container)}
      >
        <QueryPanel onResult={::this.getResults} />
        <Pivot
            data={pivotData.data}
            hirarchy={pivotData.hirarchy}
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
