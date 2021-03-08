const validate = (payload, schema) => {
  if (!schema) return { payload }
  const { error, value } = schema.validate(payload)

  return { error, payload: value }
}

module.exports = (event, schema) => {
  const path = event.pathParameters || {}
  const query = event.queryStringParameters || {}
  const body = JSON.parse(event.body) || {}

  const { error, payload } = validate(query, schema)
  return { error, payload, parameters: { ...query, ...path }, body }
}