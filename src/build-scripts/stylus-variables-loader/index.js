const loaderUtils = require('loader-utils')

module.exports = function(input) {
  this.cacheable && this.cacheable()

  const { variables = {} } = loaderUtils.getOptions(this)

  const variablesNames = Object.keys(variables)

  const stylusVariables = variablesNames.reduce((result, current) => {
    return `${current} = "${variables[current]}"
    ${result}`
  }, '')

  const content = `${stylusVariables}
    ${input}
  `

  this.value = content
  return content
}
