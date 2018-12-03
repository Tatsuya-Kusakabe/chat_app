//
// components/3_suggestionsList.js
//
// Importing components
//
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import IndexAction from '../../actions/index'
//
//
// Creating a new class 'SuggestionsList'
//
class SuggestionsList extends React.Component {
  //
  constructor(props) {
    //
    // Inheriting props (unmodifiable attributes) from 'React.component'
    //
    super(props)
    //
  }
  //
  // When an account is clicked, changing chats displayed
  //
  changeOpenUserID(id) {
    IndexAction.changeOpenUserID(id)
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
          <div className='suggestions-list__list suggestions-list__list__empty'>
            No suggestions
          </div>
      )
    //
    // When 'openUserID' does exist
    //
    } else {
      //
      // Getting details on the users as 'suggestionsList'
      //
      const suggestionsRaw = this.props.messages
      const suggestionsList = []
      //
      _.each(suggestionsRaw, (suggestion) => {
        suggestionsList.push({ user: suggestion.user })
      })
      //
      // Creating each 'suggestions-list' item from 'suggestionsList'
      //
      const users = suggestionsList.map((suggestion, index) => {
        //
        // Defining 'item_classes' for each message icon
        //
        const itemClasses = classNames({
          'clear': true,
          'suggestions-list__item': true,
          'suggestions-list__item--active': this.props.openUserID === suggestion.user.id,
        })
        //
        // Returning each 'suggestions-list' item
        //
        return (
          //
          // When an account is clicked, returning 'changeOpenUserID(friend.user.id)'
          //
          <li
            onClick={ this.changeOpenUserID.bind(this, suggestion.user.id) }
            className={ itemClasses }
            key={ suggestion.user.id }
          >
            <div className='suggestions-list__item__picture'>
              <img src={ suggestion.user.profile_picture } />
            </div>
            <div className='suggestions-list__item__details'>
              <h4 className='suggestions-list__item__name'>
                { suggestion.user.name }
              </h4>
              <span className='suggestions-list__item__message'>
                { suggestion.user.profile_comment }
              </span>
            </div>
          </li>
        )
      }, this)
      //
      // Returning 'users'
      //
      return (
        <ul className='suggestions-list__list'>
          { users }
        </ul>
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
SuggestionsList.propTypes = {
  messages: PropTypes.array,
  currentUserID: PropTypes.number,
  openUserID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}
//
export default SuggestionsList
