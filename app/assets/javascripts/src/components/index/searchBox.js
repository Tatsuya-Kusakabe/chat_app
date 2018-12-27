
import React from 'react'
import PropTypes from 'prop-types'
import UserAction from '../../actions/index/users'
import UserStore from '../../stores/index/users'

class SearchBox extends React.Component {

  async updateValue(e) {
    const { currentUserID, openUserTab } = this.props

    // Updating a state from '{ value: '', }' to '{ value: e.target.value, }'
    UserAction.updateSearchText(e.target.value)

    // Calling 'getFriends' or 'getSuggestions' with 'e.target.value'
    // ** 'this.state.value' is not updated until rendered
    openUserTab === 'Friends'
      ? await UserAction.getFriends(currentUserID, e.target.value)
      : await UserAction.getSuggestions(currentUserID, e.target.value)

    // Initializing 'openUserID' (because a set of users changes)
    UserAction.changeOpenUserID(null)
  }

  render() {
    return (
        <div className='search-box'>
          <input
            value={ UserStore.getSearchText() }
            onChange={ (e) => this.updateValue(e) }
            className='search-box__input'
            placeholder='Type names to search for..'
          />
        </div>
    )
  }
}

// Defining 'propTypes'
// ** https://morizyun.github.io/javascript/react-js-proptypes-validator.html
SearchBox.propTypes = {
  currentUserID: PropTypes.number,
  openUserTab: PropTypes.string,
}

export default SearchBox
