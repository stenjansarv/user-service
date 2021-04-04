const fetch = require('node-fetch')
const contextualize = require('../context')


const { success, invalid } = require('../respond')

const { TWITTER_BEARER_TOKEN } = process.env

exports.handler = async (event) => {
  const context = contextualize(event)

  const response = await fetch(`https://api.twitter.com/2/users/by/username/${context.twitterHandle}`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`
    }
  })

  const twitterUserPayload = await response.json()

  const payload = await fetch(`https://api.twitter.com/2/users/${twitterUserPayload.data.id}/tweets?max_results=10&exclude=replies`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`
    }
  })

  const twitterFeedPayload = await payload.json()

  return success(twitterFeedPayload)
}
