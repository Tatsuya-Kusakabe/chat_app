
import request from 'superagent'
import Dispatcher from '../../dispatcher'
import { ActionTypes, APIRoot, PicRoot, CSRFToken } from '../../utils'

// Exporting 'UserAction' using 'async/await'
// ** https://www.valentinog.com/blog/how-async-await-in-react/
export default {

  async fetchFriends(searchText) {
    try {
      // Getting data from a server (with query params), then proceeding next
      // ** https://visionmedia.github.io/superagent/#query-strings
      const response = await request
        .get(`${APIRoot}/friends`)
        .query({ search_text: searchText });
      // Catching errors besides network errors
      if (!response.ok) { throw Error(response.statusText); }
      // Defining 'json' (because it is used duplicately)
      const json = JSON.parse(response.text)
      // Changing data on 'stores' after converting a JSON string to an object
      Dispatcher.handleViewAction({
        type: ActionTypes.GET_FRIENDS,
        json: json,
      })
      // Returning 'json'
      return json;
    // If catching network errors, throwing it
    } catch(error) { console.log(error); }
  },

  async fetchSuggestions(searchText) {
    try {
      const response = await request
        .get(`${APIRoot}/suggestions`)
        .query({ search_text: searchText });
      if (!response.ok) { throw Error(response.statusText); }
      const json = JSON.parse(response.text)
      Dispatcher.handleViewAction({
        type: ActionTypes.GET_SUGGESTIONS,
        json: json,
      })
      return json;
    } catch(error) { console.log(error); }
  },

  async fetchCurrentUserID() {
    try {
      const response = await request
        .get(`${APIRoot}/current_user`);
      if (!response.ok) { throw Error(response.statusText); }
      const json = JSON.parse(response.text)
      Dispatcher.handleViewAction({
        type: ActionTypes.GET_CURRENT_USER_ID,
        json: json,
      })
      // Returning 'json.id'
      return json.id
    } catch(error) { console.log(error); }
  },

  changeOpenUserTab(userTab) {
    Dispatcher.handleViewAction({
      type: ActionTypes.CHANGE_OPEN_USER_TAB,
      userTab: userTab,
    })
  },

  changeOpenUserID(userID) {
    Dispatcher.handleViewAction({
      type: ActionTypes.CHANGE_OPEN_USER_ID,
      userID: userID,
    })
  },

  changeOpenContent(content) {
    Dispatcher.handleViewAction({
      type: ActionTypes.CHANGE_OPEN_CONTENT,
      content: content,
    })
  },

  updateSearchText(searchText) {
    Dispatcher.handleViewAction({
      type: ActionTypes.UPDATE_SEARCH_TEXT,
      searchText: searchText,
    })
  },

}
