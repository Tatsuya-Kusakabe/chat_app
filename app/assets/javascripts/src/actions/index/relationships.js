
// Importing components
import request from 'superagent'
import Dispatcher from '../../dispatcher'
import { ActionTypes, APIRoot, PicRoot, CSRFToken } from '../../utils'

// Exporting 'UserAction' using 'async/await'
// ** https://www.valentinog.com/blog/how-async-await-in-react/
export default {

  async getRelationships(userID) {
    try {
      // Defining query parameters
      const query = `self_id=${userID}`
      // Getting data from a server, then proceeding next
      const response = await request.get(`${APIRoot}/relationships?${query}`);
      // Catching errors besides network errors
      if (!response.ok) { throw Error(response.statusText); }
      // Changing data on 'stores' after converting a JSON string to an object
      Dispatcher.handleViewAction({
        type: ActionTypes.GET_RELATIONSHIPS,
        json: JSON.parse(response.text),
      })
    // If catching network errors, throwing it
    } catch(error) { console.log(error); }
  },

}
