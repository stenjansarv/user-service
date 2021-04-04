const MongoClient = require('mongodb').MongoClient
const uri = require('../../lib/connection')
const contextualize = require('../context')
const extract = require('../extract')

const { success, invalid } = require('../respond')

exports.handler = async (event) => {
  const context = contextualize(event)

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

  try {
    await client.connect()
    const collection = client.db('blog').collection('posts')

    const filter = { author: context.userId }

    const result = await collection.find(filter).toArray()
    return success(result)
  } catch (e) {
    console.error(e)
    return invalid()
  } finally {
    await client.close()
  }
}
