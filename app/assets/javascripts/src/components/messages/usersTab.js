//
// components/usersBox.js
//
// Importing components
//
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import MessagesAction from '../../actions/messages'
//
// Creating a new class 'usersBox'
//
class UsersTab extends React.Component {
  //
  constructor(props) {
    //
    // Inheriting props (unmodifiable attributes) from 'React.component'
    //
    super(props)
    //
    // When opening 'Friends' tab, calling getMessages() from 'actions/messages'
    // When opening 'Suggestions' tab, calling getSuggestions() from 'actions/messages'
    //
    this.props.openUserTab === 'Friends'
      ? MessagesAction.getMessages()
      : MessagesAction.getSuggestions()
    //
    // ** While calling, proceeding next
    // ** Do not prepend "return" to objects (in this case, promise objects).
    // ** If so, the constructor will return promise objects, not 'this'...
    //
  }
  //
  // When a tab (friends or suggestions) is clicked
  //
  changeOpenUserTab(name) {
    //
    // Updating 'openUserTab'
    //
    MessagesAction.changeOpenUserTab(name)
    //
    // Getting a JSON string according to 'openUserTab'
    //
    name === 'Friends'
      ? MessagesAction.getMessages()
      : MessagesAction.getSuggestions()
    //
  }
  //
  // Rendering results
  //
  render() {
    //
    // Creating each 'users-tab' item
    //
    const tabNames = ['Friends', 'Suggestions']
    const tabs = tabNames.map((tab, index) => {
      //
      // Defining 'item_classes' for each message icon
      //
      const itemClasses = classNames({
        'clear': true,
        'users-tab__item': true,
        'users-tab__item--active': this.props.openUserTab === tab,
      })
      //
      // Returning each 'users-tab' item
      //
      return (
          //
          // When a tab is clicked, returning 'changeOpenUserTab(message)'
          //
          <li
            onClick={ this.changeOpenUserTab.bind(this, tab) }
            className={ itemClasses }
            key={ tab }
          >
            { tab }
          </li>
          //
      )
    })
    //
    // Rendering
    //
    return (
        //
        <ul className='users-tab__list'>
          { tabs }
        </ul>
        //
    )
    //
  }
  //
}
//
// Defining 'propTypes'
// ** https://morizyun.github.io/javascript/react-js-proptypes-validator.html
//
UsersTab.propTypes = {
  openUserTab: PropTypes.string,
}
//
export default UsersTab
