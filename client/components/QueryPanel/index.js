import request from 'superagent'
import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class Pivot extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      token : '',
      jaql: '',
      url: '',
    }

    this.tokenChange = this.tokenChange.bind(this)
    this.jaqlChange = this.jaqlChange.bind(this)
    this.urlChange = this.urlChange.bind(this)
    this.sendJaql = this.sendJaql.bind(this)
  }

  tokenChange(event) {
    this.setState({
      token: event.target.value,
    })
  }

  jaqlChange(event) {
    this.setState({
      jaql: event.target.value,
    })
  }

  urlChange(event) {
    this.setState({
      url: event.target.value,
    })
  }

  sendJaql() {
    const { onResult } = this.props
    const { token, jaql, url } = this.state

    let baseUrl = url

    if (baseUrl.indexOf('://') > -1) {
        baseUrl = baseUrl.split('/')[2]
    }
    else {
        baseUrl = baseUrl.split('/')[0]
    }

    let fullToken = token

    if (!fullToken.startsWith('Bearer ')) {
      fullToken = `Bearer ${token}`
    }

    let test = 'localhost:9999'

    let parsedJaql = ''

    try {
      parsedJaql = JSON.parse(jaql)
    } catch (err) {
      console.log('err', err)
      return
    }

    let datasource = parsedJaql.datasource.id
    // request.get(`http://${baseUrl}/api/v1/dashboards`)
    // request.post(`http://${baseUrl}/api/datasources/${datasource}/jaql`)
    request.post(`http://${test}/jaqlRunner`)
    .send({
      jaql: parsedJaql,
      token: fullToken,
      baseUrl: `http://${baseUrl}`,
      datasource,
    })
    .set('Accept', 'application/json')
    // .set('Authorization', fullToken)
    .then((result) => {
      let jaqlResult = JSON.parse(result.text)

      return onResult(jaqlResult)
    }).catch((err) =>{
      console.log('err', err)
    });
  }

  render() {
    const { token, jaql, url } = this.state

    return (
      <div>
        <h3>Query Panel</h3>
        <div className={style.paramsContainer}>
          <div className={style.paramWrapper}>
            <div className={`${style.paramCell} ${style.paramLabel}`}>Base Url:</div>
            <div className={style.paramCell}>
              <input className={style.paramInput}
                  onChange={this.urlChange}
                  type="text"
                  value={url}
              />
            </div>
          </div>
          <div className={style.paramWrapper}>
            <div className={`${style.paramCell} ${style.paramLabel}`}>Token:</div>
            <div className={style.paramCell}>
              <input className={style.paramInput}
                  onChange={this.tokenChange}
                  type="text"
                  value={token}
              />
            </div>
          </div>
          <div className={style.paramWrapper}>
            <div className={`${style.paramCell} ${style.paramLabel}`}>Jaql:</div>
            <div className={style.paramCell}>
              <textarea className={style.paramInput}
                  onChange={this.jaqlChange}
                  rows="10"
                  value={jaql}
              />
            </div>
          </div>
        </div>
        <div>
          <button onClick={this.sendJaql}>Send Jaql</button>
        </div>
      </div>
    )
  }
}
