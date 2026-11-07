const dns = require('node:dns'); //needed or ig mongoose wont work
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI //add to render at env.

console.log('connecting to', url)
mongoose.connect(url, { family: 4 }) //connection to database

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean,
})

noteSchema.set('toJSON', { //removing certain properties
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() //better to change to string
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Note', noteSchema) //to import