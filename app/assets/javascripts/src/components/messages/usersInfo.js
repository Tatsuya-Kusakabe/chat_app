//
// components/friendsList.js
//
// Importing components
//
import React from 'react'
import PropTypes from 'prop-types'
import MessagesAction from '../../actions/messages'
import Utils from '../../utils'
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
  }
  //
  // When clicked, changing a friendship
  //
  changeFriendship(frs) {
    MessagesAction.Friendship(frs)
  }
  //
  // Rendering results
  //
  render() {
    //
    console.log(this.props)
    //
    // When 'current_user' has no numerical 'openUserID' (namely having no friends)
    // ** 'return' ends 'switch (true)', so 'break' is not necessary
    //
    if (!(_.isNumber(this.props.openUserID))) {
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
      const info = (this.props.openUserTab === 'Friends') ? this.props.messages : this.props.suggestions
      const userInfo = _.filter(info, {'user': {'id': this.props.openUserID}})[0]['user']
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
          // When an account is clicked, returning 'changeOpenUserID(friend.user.id)'
          */}
          <h4
            className='users-info__item__friendship'
            onClick={ this.changeFriendship.bind(this, this.props.openUserTab) }
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
