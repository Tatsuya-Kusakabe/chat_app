
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import UserAction from '../../actions/index/users'

class SuggestionsList extends React.Component {

  // When an account is clicked, changing chats displayed
  changeOpenUserID(openUserID) {
    UserAction.changeOpenUserID(openUserID)
  }

  render() {
    const { openUserID, suggestions } = this.props

    // When 'this.props' is imperfect, displaying 'No suggestions'
    // TODO: concatenate 'if' condition if possible
    if (!suggestions.length) {
      return (
          <div className='suggestions-list__list suggestions-list__list__empty'>
            No suggestions
          </div>
      )
    }

    // Putting 'user', 'message', 'timestamp' info into 'suggestionsRaw'
    const suggestionsRaw = suggestions.map((suggestion, index) => {
      let suggestionRaw = []
      suggestionRaw.user = suggestion
      return suggestionRaw
    })

    // Sorting 'suggestionsRaw' according to 'name'
    const suggestionsSorted = suggestionsRaw.sort((a, b) => {
      if (a.user.name < b.user.name) return -1;
      if (a.user.name > b.user.name) return 1;
      return 0;
    })

    // Rendering 'friendsSorted'
    const suggestionsList = suggestionsSorted.map((suggestion, index) => {

      // Defining 'item_classes' for each tab
      const itemClasses = classNames({
        'clear': true,
        'suggestions-list__item': true,
        'suggestions-list__item--active': openUserID === suggestion.user.id,
      })

      // When an account is clicked, calling 'changeOpenUserID(id)'
      // TODO: click on the top user initially
      return (
          <li
            onClick={ () => this.changeOpenUserID(suggestion.user.id) }
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

    // Returning 'suggestionsList'
    return <ul className='suggestions-list__list'>{ suggestionsList }</ul>;
  }
}

// Defining 'propTypes'
// ** https://morizyun.github.io/javascript/react-js-proptypes-validator.html
SuggestionsList.propTypes = {
  openUserID: PropTypes.number,
  suggestions: PropTypes.array,
}

export default SuggestionsList
