const dns = require('node:dns'); //needed or ig mongoose wont work
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2] //password pass to terminal

const url = `mongodb+srv://yamssichloe_db_user:${password}@cluster0.ofsc7cj.mongodb.net/noteApp?appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 }) //connection to database

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is easy',
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})

//could also do ...find({important: true})
Note.find({}).then(result => { // empty {} means whole notes collection
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})