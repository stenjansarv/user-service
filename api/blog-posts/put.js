const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const uri = require('../../lib/connection')
const contextualize = require('../context')
const extract = require('../extract')
const { get, omitBy, isUndefined } = require('lodash')

const { success, invalid } = require('../respond')

exports.handler = async (event) => {
  const context = contextualize(event)
  const { body } = extract(event)

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

  try {
    await client.connect()
    const collection = client.db('blog').collection('posts')

    const filter = { author: context.userId, postId: context.postId }

    const updatedDoc = {
      $set: omitBy({
        author: get(body, 'author', undefined),
        title: get(body, 'title', undefined),
        comments: get(body, 'comments', undefined),
        likes: get(body, 'likes', undefined),
        post: get(body, 'post', undefined),
        createdAt: get(body, 'createdAt', undefined),
        updatedAt: get(body, 'updatedAt', undefined),
       }, isUndefined)
    }

    const result = await collection.findOneAndUpdate(filter, updatedDoc, { returnNewDocument: true })

    return success(result.value)
  } catch (e) {
    console.error(e)
    return invalid()
  } finally {
    await client.close()
  }
}
