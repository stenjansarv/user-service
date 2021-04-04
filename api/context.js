const contextualize = require('../lib/context')

module.exports = (event) => {
  const { userId, postId, twitterHandle } = event.pathParameters
  if (twitterHandle) return { twitterHandle }
  const context = contextualize({ userId, postId })

  return context
}
