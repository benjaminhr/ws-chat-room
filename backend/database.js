const mongoose = require('mongoose')

//const mongoDB = "mongodb://root:ec18011@ds115854.mlab.com:15854/messages"
const mongoDB = process.env.MONGO_URL || ''

mongoose.connect(mongoDB, {useNewUrlParser: true })
mongoose.Promise = global.Promise

const db = mongoose.connection
const MessageSchema = new mongoose.Schema({
    timestamp: Number,
    text: String,
    sender: String
})

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
module.exports = mongoose.model('Messages', MessageSchema)


