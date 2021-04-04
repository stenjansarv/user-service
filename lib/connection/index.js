const { MONGODB_USER, MONGODB_PASSWORD} = process.env

const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@online-lab.gubvp.mongodb.net?retryWrites=true&w=majority`

module.exports = uri