//
// utils.js
//
// Importing components
//
import keyMirror from 'keymirror'
//
// Defining 'Action types', which makes 'Stores' decide what 'Action' to handle
//
export const ActionTypes = keyMirror({
  UPDATE_OPEN_USER_TAB: null,
  UPDATE_OPEN_CONTENT: null,
  GET_FRIENDS: null,
  GET_SUGGESTIONS: null,
  SEARCH_FRIENDS: null,
  SEARCH_SUGGESTIONS: null,
  UPDATE_OPEN_USER_ID: null,
  UPDATE_FRIENDSHIP: null,
  SEND_MESSAGE: null,
  SEND_PICTURE: null,
})
//
// Defining 'API endpoints', which names POST routing
//
const Root = window.location.origin || `${window.location.protocol}//${window.location.hostname}`
export const APIRoot = `${Root}/api`
export const PicRoot = 'assets/images'
//
// Defining 'CSRF token' for security
//
export function CSRFToken() {
  return document.querySelector('meta[name="csrf-token"]').getAttribute('content')
}
//
// Defining 'Utils' for calculating dates
//
const Utils = {
  //
  // Modifing from default, integrating itself and 'getShortDate()'
  //
  getNiceDate(timestamp) {
    //
    // Calculating the posted date from 'timestamp'
    //
    const def_days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const def_months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.',
                        'Sep.', 'Oct.', 'Nov.', 'Dec.']
    //
    // ** ex) '3' -> '03' -> '03', '21' -> '021' -> '21'
    //
    const full_date = new Date(timestamp)
    const minute = (`0${full_date.getMinutes()}`).slice(-2)
    const hour = (`0${full_date.getHours()}`).slice(-2)
    const date = (`0${full_date.getDate()}`).slice(-2)
    const day = def_days[full_date.getDay()]
    const month = def_months[full_date.getMonth()]
    //
    // ** Writing 'let year' because 'year' could be updated to 'nil'
    //
    let year = full_date.getFullYear()
    if (new Date().getFullYear() === year) {
      year = ''
    }
    //
    // Defining 'post_date' showing how early the message was post
    //
    const post_date = {
      //
      within_day: {
        1: 'less than a minute ago',
        2: 'a minute ago',
        60: '%dist_min minutes ago',
        120: 'an hour ago',
        1440: '%dist_hrs hours ago',
      },
      //
      beyond_day: {
        2: 'Yesterday at %hrs:%min',
        7: '%day at %hrs:%min',
      },
      //
    }
    //
    // Calculating 'distance' between now and the post date, on the basis of 'minute' and 'day'
    //
    const minute_now = Math.floor(+new Date() / 60000)
    const minute_post = Math.floor(timestamp / 60000)
    const dist_minute = minute_now - minute_post
    const dist_day = Math.floor(minute_now / (60 * 24)) - Math.floor(minute_post / (60 * 24))
    //
    // Defining 'hash' and 'dist' for making up 'string' to return
    //
    let hash
    let dist
    //
    // If 'distance' is within 24 hours,
    // using 'post[:within_day]' as 'hash' and 'distance_within_day' as 'dist'
    //
    if (dist_minute < 1440) {
      hash = post_date['within_day']
      dist = dist_minute
    //
    // If not, referring 'post[:beyond_day]' as 'hash' and 'distance_beyond_day' as 'dist'
    //
    } else {
      hash = post_date['beyond_day']
      dist = dist_day
    }
    //
    // Defining 'time_hash' which has keys of 'post_date'
    //
    const time_hash = Object.keys(hash).map(key => parseInt(key, 10))
    //
    // Making up 'string' to return
    //
    let string
    //
    for (let i = 0; i < time_hash.length; i++) {
      if (dist < time_hash[i]) {
        string = hash[time_hash[i]]
        break
      }
    }
    //
    // If 'string' is null (when posted earlier than 7 days ago), making up a default 'string'
    //
    if (!string) {
      string = '%date %mth %year at %hrs:%min'
    }
    //
    // Returning 'string'
    //
    return string.replace(/%dist_min/i, dist_minute)
      .replace(/%dist_hrs/i, Math.round(dist_minute / 60))
      .replace(/%min/i, minute)
      .replace(/%hrs/i, hour)
      .replace(/%date/i, date)
      .replace(/%day/i, day)
      .replace(/%mth/i, month)
      .replace(/%year/i, year)
  },
}

export default Utils
