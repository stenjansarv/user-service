const { get } = require('lodash')
const MongoClient = require('mongodb').MongoClient
const uri = require('../../lib/connection')
const contextualize = require('../context')
const extract = require('../extract')
const { v4 } = require('uuid')


const moment = require('moment')

const { success, invalid } = require('../respond')

exports.handler = async (event) => {
  const context = contextualize(event)
  const { body } = extract(event)

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

  try {
    await client.connect()
    const collection = client.db('blog').collection('posts')

    const doc = {
      author: get(body, 'author'),
      postId: v4(),
      title: get(body, 'title'),
      comments: [],
      likes: [],
      post: get(body, 'post'),
      createdAt: moment().valueOf(),
      updatedAt: moment().valueOf()
    }

    const result = await collection.insertOne(doc)

    return success(result.ops[0])
  } catch (e) {
    return invalid()
  } finally {
    await client.close()
  }
}
