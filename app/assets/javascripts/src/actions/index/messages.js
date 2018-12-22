
// Importing components
import request from 'superagent'
import Dispatcher from '../../dispatcher'
import { ActionTypes, APIRoot, PicRoot, CSRFToken } from '../../utils'

// Exporting 'UserAction' using 'async/await'
// ** https://www.valentinog.com/blog/how-async-await-in-react/
export default {

  async getLastMessages(currentUserID) {
    try {
      // Defining query parameters
      const query = `self_id=${currentUserID}&limit=1`
      // Getting data from a server, then proceeding next
      const response = await request.get(`${APIRoot}/messages?${query}`);
      // Catching errors besides network errors
      if (!response.ok) { throw Error(response.statusText); }
      // Changing data on 'stores' after converting a JSON string to an object
      Dispatcher.handleViewAction({
        type: ActionTypes.GET_LAST_MESSAGES,
        json: JSON.parse(response.text),
      })
    // If catching network errors, throwing it
    } catch(error) { console.log(error); }
  },

  async getOpenMessages(currentUserID, openUserID) {
    try {
      const query = `self_id=${currentUserID}&partner_ids[]=${openUserID}`
      const response = await request.get(`${APIRoot}/messages?${query}`);
      if (!response.ok) { throw Error(response.statusText); }
      Dispatcher.handleViewAction({
        type: ActionTypes.GET_OPEN_MESSAGES,
        json: JSON.parse(response.text),
      })
    } catch(error) { console.log(error); }
  },

}
