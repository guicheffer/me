/*-
 * ⭐️ Home file
 *
 * Responsible for the main SPA webapp importings
 *
-*/

import HomeEntry from './home/entry'

// eslint-disable-next-line no-undef
const browser = window

const { document } = browser

const initialize = () => {
  if (browser.setupApp) {
    browser.setupApp({
      before: (appName = 'App') => {
        browser[appName] = {
          HomeEntry,
        }
      },
    })
  } else { throw Error('Missing setup app implementation.') }
}

(() => {
  if (['complete', 'loaded', 'interactive'].includes(document.readyState)) {
    initialize()
  } else {
    browser.addEventListener('DOMContentLoaded', initialize, false)
  }
})()
