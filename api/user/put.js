const MongoClient = require('mongodb').MongoClient
const fetch = require('node-fetch')
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

    let modifiedGroupMembers = undefined

    if (get(body, 'group.groupMembers')) {
      const groupMembers = get(body, 'group.groupMembers')

      modifiedGroupMembers = await Promise.all(groupMembers.map(async groupMember => {
        if (!groupMember.name) {
          const response = await fetch(`https://pub.orcid.org/v3.0/${groupMember.orcidID || groupMember}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          const body = await response.json()
          const personBody = body.person

          const firstName = get(personBody, 'name.given-names.value')
          const lastName = get(personBody, 'name.family-name.value')
          const fullName = get(personBody, 'name.credit-name.value')

          return { orcidID: groupMember.orcidID || groupMember, name: fullName || `${firstName} ${lastName}`}
        }

        return groupMember
      }))
    }

    const updatedDoc = {
      $set: omitBy({
      ...(body.group && {group: {
        enabled: get(body, 'group.enabled', undefined),
        groupMembers: modifiedGroupMembers || get(body, 'group.groupMembers', undefined)
      }}),
      fullName: get(body, 'fullName', undefined),
      blog: get(body, 'blog', undefined),
      dashboard: get(body, 'dashboard', undefined),
      twitterHandle: get(body, 'twitterHandle', undefined),
      location: get(body, 'location', undefined),
      importing: get(body, 'importing', undefined),
      description: get(body, 'description', undefined),
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
