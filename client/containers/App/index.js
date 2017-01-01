import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
// import Sisense, {Widget} from '../../components/Sisense'
import Pivot from '../../components/Pivot'
import style from './style.css'
// import * as BoardActions from '../../ducks/board'
import data from '../../store/data.mock'

class App extends Component {
  render() {

    return (
      <div
          className={classnames(style.container)}
      >
        <Pivot data={data}/>
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
