//
// components/5_usersInfo.js
//
// Importing components
//
import React from 'react'
import PropTypes from 'prop-types'
import UsersAction from '../../actions/users'
import MessagesAction from '../../actions/messages'
// import Utils from '../../utils'
import _ from 'lodash'
//
// Creating a new class 'UsersInfo'
//
class UsersInfo extends React.Component {
  //
  constructor(props) {
    //
    // Inheriting props (unmodifiable attributes) from 'React.component'
    //
    super(props)
    //
    // Binding 'changeFriendship' so that
    // 'this.changeFriendship' always refers to initial 'this.props' whenever called
    // ** https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    // ** https://stackoverflow.com/questions/52034868/
    //
    this.changeFriendship = this.changeFriendship.bind(this)
    //
  }
  //
  // When clicked, changing a friendship and sending a welcome message
  //
  changeFriendship(friendship) {
    //
    UsersAction.changeFriendship(friendship, this.props.openUserID)
    //
    if (friendship === 'Suggestions') {
      MessagesAction.sendMessage(this.props.openUserID, 'You made friends!')
    }
    //
    let oppState = (friendship === 'Suggestions') ? 'Friends' : 'Suggestions'
    MessagesAction.changeOpenUserTab(oppState)
    MessagesAction.getMessages(oppState)
    //
  }
  //
  // Rendering results
  //
  render() {
    //
    // When 'current_user' is defined as 'none' (namely having no friends), displaying 'No...'
    // ** 'return' ends 'switch (true)', so 'break' is not necessary
    //
    if (_.isString(this.props.openUserID)) {
      //
      return (
          <div className='users-info__list users-info__list__empty'>
            No { this.props.openUserTab }
          </div>
      )
    //
    // When 'current_user' has any 'openUserID'
    //
    } else {
      //
      // Defining 'userInfo' and 'friendshipMsg' which triggers a friendship change
      //
      const userInfo = _.filter(this.props.messages, {'user': {'id': this.props.openUserID}})[0]['user']
      const friendshipMsg = (this.props.openUserTab === 'Friends') ? 'Unfriend?' : 'Be friends!'
      //
      // Returning each 'users-info' item
      //
      return (
        <div className='clear users-info__item'>
          <div className='users-info__item__picture'>
            <img src={ userInfo.profile_picture } />
          </div>
          <h4 className='users-info__item__name'>
            { userInfo.name }
          </h4>
          <h6 className='users-info__item__message'>
            { userInfo.profile_comment }
          </h6>
          {/*
          // When a message clicked, returning 'changeFriendship(this.props.openUserTab)'
          // ** Confirmation messages displayed according to 'window.confirm'
          // ** https://gist.github.com/primaryobjects/aacf6fa49823afb2f6ff065790a5b402
          */}
          <h4
            className='users-info__item__friendship'
            onClick={() => {
              if (window.confirm('Are you sure?')) { this.changeFriendship(this.props.openUserTab) }
            } }
          >
            { friendshipMsg }
          </h4>
        </div>
      )
      //
    }
    //
  }
  //
}
//
// Defining 'propTypes'
// ** https://morizyun.github.io/javascript/react-js-proptypes-validator.html
//
UsersInfo.propTypes = {
  messages: PropTypes.array,
  suggestions: PropTypes.array,
  currentUserID: PropTypes.number,
  openUserID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  openUserTab: PropTypes.string,
}
//
export default UsersInfo
