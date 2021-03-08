const contextualize = require('../lib/context')

module.exports = (event) => {
  const { userId } = event.pathParameters
  const context = contextualize({ userId })

  return context
}
