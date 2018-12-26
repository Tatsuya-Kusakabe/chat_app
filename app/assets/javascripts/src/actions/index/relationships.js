
import request from 'superagent'
import Dispatcher from '../../dispatcher'
import { ActionTypes, APIRoot, PicRoot, CSRFToken } from '../../utils'

// Exporting 'RelationshipAction' using 'async/await'
// ** https://www.valentinog.com/blog/how-async-await-in-react/
export default {

  async getRelationships(currentUserID) {
    try {
      // Getting data from a server (with query params), then proceeding next
      // ** https://visionmedia.github.io/superagent/#query-strings
      const response = await request
        .get(`${APIRoot}/relationships`)
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
    try {
      const response = await request
        .put(`${APIRoot}/relationships/:id`)
        .set('X-CSRF-Token', CSRFToken())
        .send({ partner_id: openUserID });
      if (!response.ok) { throw Error(response.statusText); }
    } catch(error) { console.log(error); }
  },

  async createFriendship(currentUserID, openUserID) {
    try {
      const response = await request
        .post(`${APIRoot}/relationships`)
        .set('X-CSRF-Token', CSRFToken())
        .send({ partner_id: openUserID });
      if (!response.ok) { throw Error(response.statusText); }
    } catch(error) { console.log(error); }
  },

  async destroyFriendship(currentUserID, openUserID) {
    try {
      const response = await request
        .delete(`${APIRoot}/relationships/:id`)
        .set('X-CSRF-Token', CSRFToken())
        .send({ partner_id: openUserID });
      if (!response.ok) { throw Error(response.statusText); }
    } catch(error) { console.log(error); }
  },
}
