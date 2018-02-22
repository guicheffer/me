/*- ⭐️ Main Mediator
 * ----------------------------------------------
 *
 * A Mediator orchestrates communication between components.
 * This pattern provides low coupling between components and
 * more control on when changes should happen.
 *
-*/

const abstractMediator = {
  initialize (view = {}) {
    this.view = view

    return this
  },
}

export default abstractMediator
