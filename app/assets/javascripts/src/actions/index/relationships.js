
// Importing components
import request from 'superagent'
import Dispatcher from '../../dispatcher'
import { ActionTypes, APIRoot, PicRoot, CSRFToken } from '../../utils'

// Exporting 'RelationshipAction' using 'async/await'
// ** https://www.valentinog.com/blog/how-async-await-in-react/
export default {

  async getRelationships(currentUserID) {
    try {
      // Defining query parameters
      const query = `self_id=${currentUserID}`
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

  async updateTimestamp(currentUserID, openUserID) {
    console.log(openUserID)
    try {
      const query = `self_id=${currentUserID}&partner_id=${openUserID}`
      const response = await request.put(`${APIRoot}/relationships/:id?${query}`);
      if (!response.ok) { throw Error(response.statusText); }
    } catch(error) { console.log(error); }
  }

}
