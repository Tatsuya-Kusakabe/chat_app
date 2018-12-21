
// https://www.to-r.net/media/react-tutorial10/
import React from 'react'
import _ from 'lodash'
import IndexStore from '../../stores/index'
import UsersTab from './1_usersTab'
import FriendsList from './2_friendsList'
import SuggestionsList from './3_suggestionsList'
import SearchBox from './4_searchBox'
import UserShortProf from './5_userShortProf'
import UserProf from './6_userProf'
import MessagesList from './7_messagesList'
import ReplyBox from './8_replyBox'

// Creating a new class 'App'
class App extends React.Component {

  constructor(props) {

    // Inheriting props (unmodifiable attributes) from 'React.component'
    super(props)
    this.state = this.initialState

  }

  // Equalizing 'this.initialState' and 'this.getStateFromStore(initial_bln)'
  // ** If you write "get hoge() {return fuga}", 'this.hoge' does 'fuga'
  get initialState() {
    return this.getStateFromStore()
  }

  getStateFromStore() {

    let openUserTab = IndexStore.getOpenUserTab()

    // Defining 'messages', 'suggestions', 'currentUserID', 'openUserID' and 'openUserTab'
    return {
      openUserTab: openUserTab,
      openContent: IndexStore.getOpenContent(),
      messages: IndexStore.getMessages(openUserTab),
      currentUserID: IndexStore.getCurrentUserID(),
      openUserID: IndexStore.getOpenUserID(),
    }

  }

  // Only called one time
  componentDidMount() {

    function currentUserID() {
      return UserAction.getCurrentUserID()
    }

    // 'friends' is affected by 'currentUserID'
    async function friends() {
      await currentUserID()
      const currentUserID = UserStore.getCurrentUserID()
      return UserAction.friends(currentUserID)
    }

    // 'suggestions' is affected by 'currentUserID'
    async function suggestions() {
      await currentUserID()
      const currentUserID = UserStore.getCurrentUserID()
      return UserAction.suggestions(currentUserID)
    }

    // 'lastMessages' is affected by 'currentUserID'
    async function lastMessages() {
      await currentUserID()
      const currentUserID = UserStore.getCurrentUserID()
      return MessageAction.lastMessages(currentUserID)
    }

    // 'relationships' is affected by 'currentUserID'
    async function relationships() {
      await currentUserID()
      const currentUserID = UserStore.getCurrentUserID()
      return RelationshipAction.relationships(currentUserID)
    }

    // 'openUserID' is affected by 'currentUserID' and 'timestamp'
    async function openUserID() {
      await currentUserID()
      const currentUserID = UserStore.getCurrentUserID()
      await relationships()
      const relationships = RelationshipStore.getRelationships()
      return UserAction.openUserID(currentUserID, relationships)
    }

    // 'openMessages' is affected by 'currentUserID' and 'openUserID'
    async function openMessages() {
      await currentUserID()
      const currentUserID = UserStore.getCurrentUserID()
      await openUserID()
      const openUserID = UserStore.getOpenUserID()
      return MessageAction.openMessages(currentUserID, openUserID)
    }

  }
  //
  // Updating a state from 'this.getStateFromStore()' to 'this.getStateFromStore()'
  // ** 'this.state' won't be changed until 'render'
  // ** https://likealunatic.jp/2015/07/reactjs-setstate
  //
  onStoreChange() {
    this.setState(this.getStateFromStore())
  }
  //
  // ??
  //
  componentWillMount() {
    IndexStore.onChange(this.onStoreChange.bind(this))
  }
  componentWillUnmount() {
    IndexStore.offChange(this.onStoreChange.bind(this))
  }
  //
  // Passing the parent class' 'state' to the child class 'props'
  // ** https://qiita.com/KeitaMoromizato/items/0da6c8e4264b1f206451
  //
  render() {
    //
    // Defining an object for facilitation
    // ** https://qiita.com/uto-usui/items/a9d17447fe81c17c41fa
    //
    const {openUserTab, currentUserID, openUserID} = this.state
    //
    // If 'Suggestions' tab is open
    //
    if (this.state.openUserTab === 'Suggestions') {
      //
      // Rendering 'SuggestionsList' and 'UserProf'
      //
      return (
          <div className='app'>
            <div className='users-box'>
              <UsersTab openUserTab={openUserTab} />
              <SearchBox openUserTab={openUserTab} />
              <SuggestionsList {...this.state} />
            </div>
            <div className='messages-box'>
              <UserShortProf {...this.state} />
              <UserProf {...this.state} />
            </div>
          </div>
      )
    //
    // If 'Profile' content is open
    //
    } else if (this.state.openContent === 'Profile') {
      //
      // Rendering 'FriendsList' and 'UserProf'
      //
      return (
          <div className='app'>
            <div className='users-box'>
              <UsersTab openUserTab={openUserTab} />
              <SearchBox openUserTab={openUserTab} />
              <FriendsList {...this.state} />
            </div>
            <div className='messages-box'>
              <UserShortProf {...this.state} />
              <UserProf {...this.state} />
            </div>
          </div>
      )
    //
    // If 'Messages' content is open and 'openUserID' is defined as 'none'
    //
    } else if (_.isString(this.state.openUserID)) {
      //
      // Rendering 'FriendsList' and 'MessagesList'
      //
      return (
          <div className='app'>
            <div className='users-box'>
              <UsersTab openUserTab={openUserTab} />
              <SearchBox openUserTab={openUserTab} />
              <FriendsList {...this.state} />
            </div>
            <div className='messages-box'>
              <UserShortProf {...this.state} />
              <MessagesList {...this.state} />
            </div>
          </div>
      )
    //
    // If 'Messages' content is open and 'openUserID' does exist
    //
    } else {
      //
      // Rendering 'FriendsList', 'MessagesList' and 'ReplyBox'
      //
      return (
          <div className='app'>
            <div className='users-box'>
              <UsersTab openUserTab={openUserTab}/>
              <SearchBox openUserTab={openUserTab}/>
              <FriendsList {...this.state}/>
            </div>
            <div className='messages-box'>
              <UserShortProf {...this.state}/>
              <MessagesList {...this.state}/>
              <ReplyBox openUserID={openUserID} currentUserID={currentUserID}/>
            </div>
          </div>
      )
      //
    }
    //
  }
  //
}
//
export default App
