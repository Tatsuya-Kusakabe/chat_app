
// https://www.to-r.net/media/react-tutorial10/
import React from 'react'
import _ from 'lodash'
import UserAction from '../../actions/index/users.js'
import MessageAction from '../../actions/index/messages.js'
import RelationshipAction from '../../actions/index/relationships.js'
import UserStore from '../../stores/index/users.js'
import MessageStore from '../../stores/index/messages.js'
import RelationshipStore from '../../stores/index/relationships.js'
// import UsersTab from './1_usersTab'
// import FriendsList from './2_friendsList'
// import SuggestionsList from './3_suggestionsList'
// import SearchBox from './4_searchBox'
// import UserShortProf from './5_userShortProf'
// import UserProf from './6_userProf'
// import MessagesList from './7_messagesList'
// import ReplyBox from './8_replyBox'

// Creating a new class 'App'
class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = { }
  }

  // Getting data from a database (updating 'state' with event handlers later)
  // ** https://www.valentinog.com/blog/how-async-await-in-react/
  async componentDidMount() {
    // 'currentUserID' is necessary for 'Action' below
    await UserAction.getCurrentUserID()
    const currentUserID = UserStore.getCurrentUserID()
    // Running after 'currentUserID' is set
    UserAction.getFriends(currentUserID)
    UserAction.getSuggestions(currentUserID)
    MessageAction.getLastMessages(currentUserID)
    // 'relationship' is necessary for 'Action' below
    await RelationshipAction.getRelationships(currentUserID)
    const relationships = RelationshipStore.getRelationships()
    // Running after 'relationships' is set
    // 'openUserID' is necessary for 'Action' below
    await UserAction.getOpenUserID(currentUserID, relationships)
    const openUserID = UserStore.getOpenUserID()
    // Running after 'openUserID' is set
    MessageAction.getOpenMessages(currentUserID, openUserID)
    //
  }

  getStateFromStore() {
    return {
      currentUserID: UserStore.getCurrentUserID(),
      openUserID: UserStore.getOpenUserID(),
      friends: UserStore.getFriends(),
      suggestions: UserStore.getSuggestions(),
      openMessages: MessageStore.getOpenMessages(),
      lastMessages: MessageStore.getLastMessages(),
      relationships: RelationshipStore.getRelationships(),
    }
  }

  // Updating a state from 'this.getStateFromStore()' to 'this.getStateFromStore()'
  // ** 'this.state' won't be changed until 'render'
  // ** https://likealunatic.jp/2015/07/reactjs-setstate
  onStoreChange() {
    this.setState(this.getStateFromStore())
  }

  // ??
  componentWillMount() {
    UserStore.onChange(this.onStoreChange.bind(this))
    MessageStore.onChange(this.onStoreChange.bind(this))
    RelationshipStore.onChange(this.onStoreChange.bind(this))
  }
  componentWillUnmount() {
    UserStore.offChange(this.onStoreChange.bind(this))
    MessageStore.offChange(this.onStoreChange.bind(this))
    RelationshipStore.offChange(this.onStoreChange.bind(this))
  }
  //
  // Passing the parent class' 'state' to the child class 'props'
  // ** https://qiita.com/KeitaMoromizato/items/0da6c8e4264b1f206451
  //
  render() {
    console.log(this.state)
    return <div>Test</div>;
    //
    // Defining an object for facilitation
    // ** https://qiita.com/uto-usui/items/a9d17447fe81c17c41fa
    //
    // const {openUserTab, currentUserID, openUserID} = this.state
    //
    // If 'Suggestions' tab is open
    //
    // if (this.state.openUserTab === 'Suggestions') {
      //
      // Rendering 'SuggestionsList' and 'UserProf'
      //
      // return (
      //     <div className='app'>
      //       <div className='users-box'>
      //         <UsersTab openUserTab={openUserTab} />
      //         <SearchBox openUserTab={openUserTab} />
      //         <SuggestionsList {...this.state} />
      //       </div>
      //       <div className='messages-box'>
      //         <UserShortProf {...this.state} />
      //         <UserProf {...this.state} />
      //       </div>
      //     </div>
      // )
    //
    // If 'Profile' content is open
    //
    // } else if (this.state.openContent === 'Profile') {
      //
      // Rendering 'FriendsList' and 'UserProf'
      //
      // return (
      //     <div className='app'>
      //       <div className='users-box'>
      //         <UsersTab openUserTab={openUserTab} />
      //         <SearchBox openUserTab={openUserTab} />
      //         <FriendsList {...this.state} />
      //       </div>
      //       <div className='messages-box'>
      //         <UserShortProf {...this.state} />
      //         <UserProf {...this.state} />
      //       </div>
      //     </div>
      // )
    //
    // If 'Messages' content is open and 'openUserID' is defined as 'none'
    //
    // } else if (_.isString(this.state.openUserID)) {
      //
      // Rendering 'FriendsList' and 'MessagesList'
      //
      // return (
      //     <div className='app'>
      //       <div className='users-box'>
      //         <UsersTab openUserTab={openUserTab} />
      //         <SearchBox openUserTab={openUserTab} />
      //         <FriendsList {...this.state} />
      //       </div>
      //       <div className='messages-box'>
      //         <UserShortProf {...this.state} />
      //         <MessagesList {...this.state} />
      //       </div>
      //     </div>
      // )
    //
    // If 'Messages' content is open and 'openUserID' does exist
    //
    // } else {
      //
      // Rendering 'FriendsList', 'MessagesList' and 'ReplyBox'
      //
      // return (
      //     <div className='app'>
      //       <div className='users-box'>
      //         <UsersTab openUserTab={openUserTab}/>
      //         <SearchBox openUserTab={openUserTab}/>
      //         <FriendsList {...this.state}/>
      //       </div>
      //       <div className='messages-box'>
      //         <UserShortProf {...this.state}/>
      //         <MessagesList {...this.state}/>
      //         <ReplyBox openUserID={openUserID} currentUserID={currentUserID}/>
      //       </div>
      //     </div>
      // )
      //
    // }
    //
  }
  //
}
//
export default App
