import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class Pivot extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      token : localStorage.getItem('QueryPanel.token')||'',
      jaql: localStorage.getItem('QueryPanel.jaql')||'',
      url: localStorage.getItem('QueryPanel.url')||'localhost:8888',
      chunksLimit: localStorage.getItem('QueryPanel.chunksLimit')||1,
      pageSize: localStorage.getItem('QueryPanel.pageSize')||25,
      pageNumber: localStorage.getItem('QueryPanel.pageNumber')||1,
    }
  }

  changeStateProp(name, value){
    localStorage.setItem(`QueryPanel.${name}`, value)
    this.setState({
      [name]:value,
    })
  }

  render() {
    const { startStream, stopStream } = this.props
    const { token, jaql, url, chunksLimit, pageSize, pageNumber } = this.state

    return (
      <div>
        <h3>Query Panel</h3>
        <div className={style.paramsContainer}>
          <div className={style.paramWrapper}>
            <div className={classnames(style.paramCell)}>Base Url:</div>
            <div className={style.paramInputContainer}>
              <input className={style.paramInput}
                  onChange={(e)=>::this.changeStateProp('url', e.target.value)}
                  type="text"
                  value={url}
              />
            </div>
          </div>
          <div className={style.paramWrapper}>
            <div className={classnames(style.paramCell)}>Token:</div>
            <div className={style.paramInputContainer}>
              <input className={style.paramInput}
                  onChange={(e)=>::this.changeStateProp('token',e.target.value)}
                  type="text"
                  value={token}
              />
            </div>
          </div>
          <div className={style.paramWrapper}>
            <div className={classnames(style.paramCell)}>Chunks:</div>
            <div className={style.paramInputContainer}>
              <input className={style.paramInput}
                  onChange={(e)=>::this.changeStateProp('chunksLimit',e.target.value)}
                  type="number"
                  value={chunksLimit}
              />
            </div>
          </div>
          <div className={style.paramWrapper}>
            <div className={classnames(style.paramLabel)}>Jaql:</div>
            <div className={style.paramInputContainer}>
              <textarea className={style.paramInput}
                  onChange={(e)=>::this.changeStateProp('jaql', e.target.value)}
                  rows="10"
                  value={jaql}
              />
            </div>
          </div>
          <div className={style.paramWrapper}>
            <div className={classnames(style.paramCell)}>Page Size:</div>
            <div className={style.paramInputContainer}>
              <input className={style.paramInput}
                  onChange={(e)=>::this.changeStateProp('pageSize', e.target.value)}
                  type="number"
                  value={pageSize}
              />
            </div>
          </div>
          <div className={style.paramWrapper}>
            <div className={classnames(style.paramCell)}>Page Number:</div>
            <div className={style.paramInputContainer}>
              <input className={style.paramInput}
                  onChange={(e)=>::this.changeStateProp('pageNumber', e.target.value)}
                  type="number"
                  value={pageNumber}
              />
            </div>
          </div>
        </div>
        <div className={style.buttonContainer}>
          <div>
            <button>Send Jaql</button>
          </div>
          <div>
            <button onClick={()=>startStream(token, jaql, url, chunksLimit, pageSize, pageNumber)}>Try Streaming</button>
          </div>
          <div>
            <button onClick={stopStream}>Stop Streaming</button>
          </div>
        </div>
      </div>
    )
  }
}
