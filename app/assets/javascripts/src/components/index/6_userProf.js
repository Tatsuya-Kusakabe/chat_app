//
// components/5_userInfo.js
//
// Importing components
//
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import IndexAction from '../../actions/index'
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
    IndexAction.changeFriendship(friendship, this.props.openUserID)
    //
    if (friendship === 'Suggestions') {
      IndexAction.sendMessage(this.props.openUserID, 'You made friends!')
    }
    //
    let oppState = (friendship === 'Suggestions') ? 'Friends' : 'Suggestions'
    IndexAction.changeOpenUserTab(oppState)
    IndexAction.getMessages(oppState)
    //
  }
  //
  // Rendering results
  //
  render() {
    //
    // When 'openUserID' is defined as 'none' (namely having no friends), displaying 'No...'
    // ** 'return' ends 'switch (true)', so 'break' is not necessary
    //
    if (_.isString(this.props.openUserID)) {
      //
      return (
          <div className='user-prof__list user-prof__list__empty'>
            No { this.props.openUserTab }
          </div>
      )
    //
    // When 'openUserID' does exist
    //
    } else {
      //
      // Defining 'userInfo' and 'friendshipMsg' which triggers a friendship change
      //
      const userInfo = _.filter(this.props.messages, {'user': {'id': this.props.openUserID}})[0]['user']
      const friendshipMsg = (this.props.openUserTab === 'Friends') ? 'Unfriend?' : 'Be friends!'
      //
      // Defining 'item_classes' to distinguish 'openUserTab'
      // ** https://www.npmjs.com/package/classnames
      //
      const baseClasses = [{
        'friends': this.props.openUserTab === 'Friends',
        'suggestions': this.props.openUserTab === 'Suggestions',
      }]
      //
      const itemClasses = classNames('clear user-prof__item', baseClasses)
      const picClasses = classNames('user-prof__item__picture', baseClasses)
      const frsClasses = classNames('user-prof__item__friendship', baseClasses)
      //
      // Returning each 'user-prof' item
      //
      return (
        <div className={ itemClasses }>
          <div className={ picClasses }>
            <img src={ userInfo.profile_picture } />
          </div>
          <h4 className='user-prof__item__name'>
            { userInfo.name }
          </h4>
          <h6 className='user-prof__item__message'>
            { userInfo.profile_comment }
          </h6>
          {/*
          // When a message clicked, returning 'changeFriendship(this.props.openUserTab)'
          // ** Confirmation messages displayed according to 'window.confirm'
          // ** https://gist.github.com/primaryobjects/aacf6fa49823afb2f6ff065790a5b402
          */}
          <h4
            className={ frsClasses }
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
  openUserTab: PropTypes.string,
  openContent: PropTypes.string,
  messages: PropTypes.array,
  currentUserID: PropTypes.number,
  openUserID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}
//
export default UsersInfo
