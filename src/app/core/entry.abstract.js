/*- ⭐️ Abstract Entry Point
 * ----------------------------------------------
 *
 * Each page has its own entry in a way that bundles can be loaded separately. This abstraction
 * offers a simple way to create new bundles/entries by exposing a registry DSL that will be used
 * to start each dependency.
 *
 * React's Application is being extended used, so it becomes an obvious starting point. Every
 * dependency and set of page components are started here through declarative registers
 * `stores`, `actions`, `dispatchers`, `stores` and `views`.
 *
-*/

import mediator from '../commons/mediator'

class AbstractEntry {
  constructor ({ initilizationData }) { this._setup({ initilizationData }) }

  _setup ({ initilizationData }) {
    this.eventBus = mediator
    this.start({ eventBus: this.eventBus, initilizationData })

    // eslint-disable-next-line no-console
    console.info([
      '💻 Hey, we can have a conversation about what has been done here if you want! 🙂 \n\n',
      '💌 hi@guicheffer.me is my email btw 🤙🏼',
    ].join(''))
  }

  start () { throw Error('Missing start implementation.') }
}

export default AbstractEntry
