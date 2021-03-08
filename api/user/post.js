const client = require('../../lib/connection')
const contextualize = require('../context')
const extract = require('../extract')

const { success, invalid } = require('../respond')

exports.handler = async (event) => {
  const context = contextualize(event)
  const { payload, body } = extract(event)

  try {
    await client.connect()
    const collection = client.db('user_data').collection('users')

    const doc = { 
      email: body.email,
      orcidID: context.userId, 
      group: {
        enabled: false,
        groupMembers: [context.userId]
      },
      fullName: null,
      researcher: !!context.userId,
      // importing: true
    }

    const result = await collection.insertOne(doc)
    return success(result.ops[0])
  } catch (e) {
    return invalid()
  } finally {
    await client.close();
  }
}
