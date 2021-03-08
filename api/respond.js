const success = data => {
  if (!data) return { 
    statusCode: 204, 
    body: JSON.stringify({ message: 'The API call was successful.'}),
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true // Required for CORS support to work
    }
  }
  return { 
    statusCode: 200,
    body: JSON.stringify(data),
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true // Required for CORS support to work
    }
  }
}

const invalid = (error = {}) => {
  // const messages = (error.body.error.root_cause || []).map(item => item.reason)
  const messages = 'error'
  return {
    statusCode: 400,
    body: JSON.stringify({ message: 'Invalid request', errors: messages }),
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true // Required for CORS support to work
    }
  }
}

module.exports = {
  success,
  invalid
}
