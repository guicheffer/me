/*- ⭐️ Common Mediator
 * ----------------------------------------------
 *
 * Mediates events which belong to all guicheffer.me project
 *
-*/

import _ from 'lodash'

import abstractMediator from '../core/mediator.abstract'

const mediator = _.assign(Object.create(abstractMediator), {})

export default mediator
