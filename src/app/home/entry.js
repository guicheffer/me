/*-
 * ⭐️ HomeEntry
 *
 * This is the home entry file for guicheffer.me/
 *
-*/

import AbstractEntry from '../core/entry.abstract'

class HomeEntry extends AbstractEntry {
  start ({ eventBus, initilizationData }) {
    this.initilizationData = initilizationData
    this.eventBus = eventBus.initialize(this)
  }
}

export default HomeEntry
