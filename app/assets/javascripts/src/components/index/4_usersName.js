//
// components/4_usersName.js
//
// Importing components
//
import React from 'react'
import PropTypes from 'prop-types'
import UsersAction from '../../actions/users'
// import Utils from '../../utils'
import _ from 'lodash'
//
// Creating a new class 'UsersName'
//
class UsersName extends React.Component {
  //
  constructor(props) {
    //
    // Inheriting props (unmodifiable attributes) from 'React.component'
    //
    super(props)
    //
  }
  //
  // When clicked, changing a main content displayed
  //
  changeOpenContent(content) {
    //
    UsersAction.changeOpenContent(content)
    //
  }
  //
  // Rendering results
  //
  render() {
    //
    const dispContent = (this.props.openContent === 'Profile') ? 'Messages' : 'Profile'
    //
    // When 'current_user' is defined as 'none' (namely having no friends),
    // or 'suggestions' tab is open, displaying nothing
    // ** 'return' ends 'switch (true)', so 'break' is not necessary
    //
    if ((_.isString(this.props.openUserID)) || (this.props.openUserTab === 'Suggestions')) {
      //
      return (<div className='users-info__list users-info__list__empty'></div>)
      //
    }
    //
    // Defining 'userInfo' and 'friendshipMsg' which triggers a friendship change
    //
    const userInfo = _.filter(this.props.messages, {'user': {'id': this.props.openUserID}})[0]['user']
    //
    // Returning each 'users-name' item
    //
    return (
        <div className='clear users-name__item'>
          <h4 className='users-name__item__name'>
            { userInfo.name }
          </h4>
          <h6
            className='users-name__item__content'
            onClick={ this.changeOpenContent.bind(this, dispContent) }
          >
            See { dispContent }
          </h6>
        </div>
    )
    //
  }
  //
}
//
// Defining 'propTypes'
// ** https://morizyun.github.io/javascript/react-js-proptypes-validator.html
//
UsersName.propTypes = {
  messages: PropTypes.array,
  currentUserID: PropTypes.number,
  openUserID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  openUserTab: PropTypes.string,
  openContent: PropTypes.string,
}
//
export default UsersName
