// components/messages/replyBox.js

import React from 'react'
import MessagesStore from '../../stores/messages'
import MessagesAction from '../../actions/messages'

class ReplyBox extends React.Component {

  constructor(props) {
    //
    // Inheriting props  (modifiable   values) from 'React.component'
    // Inheriting states (unmodifiable values) as   'this.getStateFromStore()'
    //
    super(props)
    this.state = this.initialState
  }
  //
  // Equalizing 'this.initialState' and '{ value: '', }'
  // ** If you write "get hoge() {return fuga}", 'this.hoge' does 'fuga'
  //
  get initialState() {
    return { value: '' }
  }
  //
  // Updating a state from '{ value: '', }' to '{ value: e.target.value, }'
  //
  updateValue(e) {
    this.setState({ value: e.target.value })
  }
  //
  // When pressing Enter (code 13),
  // calling sendMessage() from 'stores/messages' and
  // updating a state from '{ value: this.state.value, }' to '{ value: '', }'
  //
  handleKeyDown(e) {
    if (e.keyCode === 13) {
      MessagesAction.sendMessage(MessagesStore.getOpenChatUserID(), this.state.value)
      this.setState({ value: '' })
    }
  }
  //
  // Rendering results
  //
  render() {
    return (
      <div className='reply-box'>
        <input
          value={ this.state.value }
          onKeyDown={ this.handleKeyDown.bind(this) }
          onChange={ this.updateValue.bind(this) }
          className='reply-box__input'
          placeholder='Type message to reply..'
        />
        <span className='reply-box__tip'>
          Press <span className='reply-box__tip__button'>Enter</span> to send
        </span>
      </div>
    )
  }
}

export default ReplyBox
