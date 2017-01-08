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
import transformer from '../../store/transformer'
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
    this.setState({
      pivotData: transformer.jaqlresultToPivot(results),
    })
  }

  getChunk(chunk) {

    const { pivotData } = this.state

    let newData = []

    for (let key in chunk) {
      newData.push(chunk[key])
      newData.push(chunk[key])
    }

    let newValues = pivotData.data
    newValues.push(newData)

    var results = {
      hirarchy: Object.keys(chunk).map((curr)=> {
        return {
          name: curr,
          type: 'row',
        }
      }),
      data: newValues,
    }

    this.setState({
      pivotData: results
    })
  }

  startStream() {
    let results = {
      hirarchy: [],
      data: [],
    }

    this.setState({
      pivotData: results,
    })
  }

  render() {
    // const pivotData = transformer.jaqlresultToPivot(mockData)
    const { pivotData } = this.state

    return (
      <div
          className={classnames(style.container)}
      >
        <QueryPanel onResult={::this.getResults} onChunk={::this.getChunk} onStream={::this.startStream}/>
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
