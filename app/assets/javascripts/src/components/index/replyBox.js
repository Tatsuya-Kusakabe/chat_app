
import React from 'react'
import PropTypes from 'prop-types'
import MessageAction from '../../actions/index/messages'

class ReplyBox extends React.Component {

  constructor(props) {
    super(props)
    this.state = { text: '', picture: '' }
  }

  // Updating a state from '{ value: '', }' to '{ value: e.target.value, }'
  updateText(e) {
    this.setState({ text: e.target.value })
  }

  // Calling 'sendPicture()' and 'getOpenMessages()'
  // ** https://qiita.com/To_BB/items/27c864a46f35545122c2
  sendPicture(e) {
    // ** Somehow not warned as 'Duplicate definition'
    const { openUserID } = this.props
    this.setState({ picture: e.target.files[0] })
    MessageAction.sendPicture(openUserID, e.target.files[0])
    this.setState({ picture: '' })
  }

  // When pressing Enter (code 13),
  // calling 'sendMessage()' and 'getMessages()', and initializing 'state'
  sendMessage(e) {
    if (e.keyCode === 13) {
      // ** Somehow not warned as 'Duplicate definition'
      const { openUserID } = this.props
      MessageAction.sendMessage(openUserID, e.target.value)
      this.setState({ text: '' })
    }
  }

  render() {
    return (
      <div className='reply-box'>
        {/**/}
        <input
          value={ this.state.text }
          onChange={ (e) => this.updateText(e) }
          onKeyDown={ (e) => this.sendMessage(e) }
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
            onChange={ (e) => this.sendPicture(e) }
            accept='image/png, image/jpeg, image/gif'
          />
        </label>
        {/**/}
      </div>
    )
  }
}

// Defining 'propTypes'
// ** https://morizyun.github.io/javascript/react-js-proptypes-validator.html
ReplyBox.propTypes = {
  openUserID: PropTypes.number,
}

export default ReplyBox
