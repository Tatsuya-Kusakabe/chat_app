
import request from 'superagent'
import Dispatcher from '../../dispatcher'
import { ActionTypes, APIRoot, PicRoot, CSRFToken } from '../../utils'

// Exporting 'MessageAction' using 'async/await'
// ** https://www.valentinog.com/blog/how-async-await-in-react/
export default {

  async getLastMessages(currentUserID) {
    try {
      // Getting data from a server (with query params), then proceeding next
      // ** https://visionmedia.github.io/superagent/#query-strings
      const response = await request
        .get(`${APIRoot}/messages`)
        .query({ limit: 1 });
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
      const response = await request
        .get(`${APIRoot}/messages`)
        .query(`partner_ids[]=${openUserID}`);
      if (!response.ok) { throw Error(response.statusText); }
      Dispatcher.handleViewAction({
        type: ActionTypes.GET_OPEN_MESSAGES,
        json: JSON.parse(response.text),
      })
    } catch(error) { console.log(error); }
  },

  async sendMessage(currentUserID, openUserID, message) {
    try {
      const response = await request
        .post(`${APIRoot}/messages`)
        .set('X-CSRF-Token', CSRFToken())
        .send({ partner_id: openUserID, contents: message });
      if (!response.ok) { throw Error(response.statusText); }
    } catch(error) { console.log(error); }
  },

  async sendPicture(currentUserID, openUserID, picture) {
    try {
      const response = await request
        .post(`${APIRoot}/messages`)
        .set('X-CSRF-Token', CSRFToken())
        .attach('picture', picture)
        .field('partner_id', openUserID)
        .field('contents', 'A picture was sent!');
      if (!response.ok) { throw Error(response.statusText); }
    } catch(error) { console.log(error); }
  },

}
