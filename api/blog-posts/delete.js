const MongoClient = require('mongodb').MongoClient
const uri = require('../../lib/connection')
const contextualize = require('../context')

const { success, invalid } = require('../respond')

exports.handler = async (event) => {
  const context = contextualize(event)

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

  try {
    await client.connect()
    const collection = client.db('blog').collection('posts')

    const filter = { author: context.userId, postId: context.postId }
    const result = await collection.findOneAndDelete(filter, { returnNewDocument: true })

    return success(result.value)
  } catch (e) {
    console.error(e)
    return invalid()
  } finally {
    await client.close()
  }
}
