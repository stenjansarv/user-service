const MongoClient = require('mongodb').MongoClient
const uri = require('../../lib/connection')
const contextualize = require('../context')
const extract = require('../extract')

const moment = require('moment')

const { success, invalid } = require('../respond')

exports.handler = async (event) => {
  const context = contextualize(event)
  const { body } = extract(event)

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

  try {
    await client.connect()
    const collection = client.db('user_data').collection('users')

    const doc = { 
      email: body.email,
      orcidID: context.userId, 
      group: {
        enabled: false,
        groupMembers: [{ orcidID: context.userId }]
      },
      fullName: null,
      researcher: !!context.userId,
      blog: false,
      dashboard: [],
      description: null,
      twitterHandle: null,
      importing: false,
      registerDate: moment().valueOf()
    }

    const result = await collection.insertOne(doc)
    return success(result.ops[0])
  } catch (e) {
    return invalid()
  } finally {
    await client.close()
  }
}
