const MongoClient = require('mongodb').MongoClient
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
    const collection = client.db('user_data').collection('users')

    const filter = { orcidID: context.userId }

    const updatedDoc = {
      $set: omitBy({
      ...(body.group && {group: {
        enabled: get(body, 'group.enabled', undefined),
        groupMembers: get(body, 'group.groupMembers', undefined)
      }}),
      fullName: get(body, 'fullName', undefined),
      blog: get(body, 'blog', undefined),
      dashboard: get(body, 'dashboard', undefined),
      twitterHandle: get(body, 'twitterHandle', undefined),
      location: get(body, 'location', undefined),
      importing: get(body, 'importing', undefined),
      registerDate: get(body, 'registerDate', undefined)
    }, isUndefined)
  }

    const result = await collection.findOneAndUpdate(filter, updatedDoc, { returnNewDocument: true })

    console.error(result)

    return success(result.value)
  } catch (e) {
    console.error(e)
    return invalid()
  } finally {
    await client.close()
  }
}
