import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
// import Sisense, {Widget} from '../../components/Sisense'
import Pivot from '../../components/Pivot'
import QueryPanel from '../../components/QueryPanel'
import style from './style.css'
// import * as BoardActions from '../../ducks/board'
import data from '../../store/data.mock'

class App extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      pivotData : data,
    }

    this.getResults = this.getResults.bind(this)

  }

  getResults(results) {
    this.setState({
      pivotData: results,
    })
  }

  render() {
    const { pivotData } = this.state

    return (
      <div
          className={classnames(style.container)}
      >
        <QueryPanel onResult={this.getResults}/>
        <hr />
        <Pivot data={pivotData}/>
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
