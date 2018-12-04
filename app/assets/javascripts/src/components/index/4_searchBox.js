//
// components/4_searchBox.js
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
    return { value: '' }
  }
  //
  updateValue(e) {
    //
    // Updating a state from '{ value: '', }' to '{ value: e.target.value, }'
    //
    this.setState({ value: e.target.value })
    //
    // Calling 'searchUsers'
    // ** Using 'e.target.value', because 'this.state.value' is not updated until 'render'
    //
    IndexAction.searchUsers(this.props.openUserTab, e.target.value)
    //
  }
  //
  // Rendering results
  //
  render() {
    return (
        <div className='search-box'>
          <input
            value={ this.state.value }
            onChange={ this.updateValue.bind(this) }
            className='search-box__input'
            placeholder='Type names to search for..'
          />
        </div>
    )
  }
}
//
// Defining 'propTypes'
// ** https://morizyun.github.io/javascript/react-js-proptypes-validator.html
//
ReplyBox.propTypes = {
  openUserTab: PropTypes.string,
}
//
export default ReplyBox
