// constants/app.js

import keyMirror from 'keymirror'
//
// Defining action types, which makes 'Stores' decide what 'Action' to handle
//
export const ActionTypes = keyMirror({
  UPDATE_OPEN_CHAT_ID: null,
  SEND_MESSAGE: null,
  GET_MESSAGES: null,
})
//
// Defining API endpoints, which names POST routing
//
const Root = window.location.origin || `${window.location.protocol}//${window.location.hostname}`
const APIRoot = `${Root}/api`
//
export const APIEndpoints = {
  CREATE: APIRoot + '/messages',
}
//
// Defining CSRF token for security
//
export function CSRFToken() {
  return document.querySelector('meta[name="csrf-token"]').getAttribute('content')
}
