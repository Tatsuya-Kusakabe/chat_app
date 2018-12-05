//
// components/8_replyBox.js
//
// Importing components
//
import React from 'react'
import PropTypes from 'prop-types'
import IndexAction from '../../actions/index'
//
// Creating a new class 'ReplyBox'
//
class ReplyBox extends React.Component {

  constructor(props) {
    //
    // Inheriting props  (modifiable   values) from 'React.component'
    // Inheriting states (unmodifiable values) as   'this.getStateFromStore()'
    //
    super(props)
    this.state = this.initialState
    //
  }
  //
  // Equalizing 'this.initialState' and '{ value: '', }'
  // ** If you write "get hoge() {return fuga}", 'this.hoge' does 'fuga'
  //
  get initialState() {
    return { text: '', picture: '' }
  }
  //
  // Updating a state from '{ value: '', }' to '{ value: e.target.value, }'
  //
  updateText(e) {
    this.setState({ text: e.target.value })
  }
  //
  // Calling 'sendPicture()' and 'getMessages()' from 'actions/index'
  // ** https://qiita.com/To_BB/items/27c864a46f35545122c2
  //
  sendPicture(e) {
    //
    this.setState({ picture: e.target.files[0] })
    IndexAction.sendPicture(this.props.currentUserID, this.props.openUserID, e.target.files[0])
    IndexAction.getMessages('Friends')
    this.setState({ picture: '' })
    //
  }
  //
  // When pressing Enter (code 13),
  // calling 'sendMessage()' and 'getMessages()' from 'actions/index', and
  // updating a state from '{ value: this.state.value, }' to '{ value: '', }'
  //
  sendMessage(e) {
    if (e.keyCode === 13) {
      IndexAction.sendMessage(this.props.openUserID, this.state.value)
      IndexAction.getMessages('Friends')
      this.setState({ text: '' })
    }
  }
  //
  // Rendering results
  //
  render() {
    console.log(this.state)
    return (
      <div className='reply-box'>
        {/**/}
        <input
          value={ this.state.text }
          onChange={ this.updateText.bind(this) }
          onKeyDown={ this.sendMessage.bind(this) }
          className='reply-box__text'
          placeholder='Type message to reply..'
        />
        <span className='reply-box__tip'>
          Press <span className='reply-box__tip__button'>Enter</span> to send
        </span>
        {/*
        // Re-designing 'select file' button
        // ** http://creator.dena.jp/archives/43699692.html
        */}
        <label className='reply-box__picture' >
          <img src='/assets/images/picture_icon.png'/>
          <input
            type='file' ref='file' name='picture'
            onChange={ this.sendPicture.bind(this) }
            accept='image/png, image/jpeg, image/gif'
          />
        </label>
        {/**/}
      </div>
    )
  }
}
//
// Defining 'propTypes'
// ** https://morizyun.github.io/javascript/react-js-proptypes-validator.html
//
ReplyBox.propTypes = {
  currentUserID: PropTypes.number,
  openUserID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}
//
export default ReplyBox
