const MongoClient = require('mongodb').MongoClient
const uri = require('../../lib/connection')
const extract = require('../extract')

const { success, invalid } = require('../respond')

exports.handler = async (event) => {
  const { payload } = extract(event)

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

  try {
    await client.connect()
    const collection = client.db('user_data').collection('users')

    const doc = { email: payload.email }

    const result = await collection.findOne(doc)
    return success(result)
  } catch (e) {
    console.error(e)
    return invalid()
  } finally {
    await client.close()
  }
}
