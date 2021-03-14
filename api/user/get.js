const client = require('../../lib/connection')
const contextualize = require('../context')
const extract = require('../extract')

const { success, invalid } = require('../respond')

exports.handler = async (event) => {
  const { payload } = extract(event)

  try {
    await client.connect()
    const collection = client.db('user_data').collection('users')

    const doc = { email: payload.email }

    const result = await collection.findOne(doc)
    return success(result)
  } catch (e) {
    console.error(e)
    return invalid()
  }
}
