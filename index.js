require('dotenv').config() //use .env file
const express = require('express')
const app = express()
const Note = require('./models/note')

app.use(express.json()) //used to post/create note; creates the body
app.use(express.static('dist')) //to show static files; html, js,etc
app.use(requestLogger) //executed in order


//middleware; functions used for handling requestand responses

function requestLogger(request, response, next){
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next() //goes to new middleware
}

function unknownEndpoint(request, response){
  response.status(404).send({ error: 'unknown endpoint' })
}

function errorHandler(error, request, response, next){
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(express.json()) //used to post/create note; creates the body
app.use(express.static('dist')) //to show static files; html, js,etc
app.use(requestLogger) //executed in order


// getting the notes

app.get('/', (request, response) => { //handle request at the root ('/')
  response.send('<h1>Hello World!</h1>') //express automatically sets value to text/html
})

app.get('/api/notes', (request, response) => { //handle request made to notes
  Note.find({}).then(notes=>{
      response.json(notes) //sends notes array as a json string; sets value as application/json
  }) 
})

app.get('/api/notes/:id', (request, response, next) => { //route for a specific note
  Note.findById(request.params.id).then(note=>{
  if(note){
  response.json(note)
  } else {
    response.status(404).end() //change status if note not found
  }
})
.catch(error=> next(error))}) //if promise is rejected; passes error to express

// creating note
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) { //if note is empty
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = new Note({ //using the MDB schema
    content: body.content,
    important: body.important || false, //if missing; default to missing
  })
  note.save().then((savedNote)=>{
    response.json(savedNote)
  })
})

//updating note

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findById(request.params.id)
  .then(note => {
    if (!note){
      return response.status(404).end()
    }

    note.content = content
    note.important = important

    return note.save().then((updatedNote)=>{
      response.json(updatedNote)
    })
  })
  .catch(error=>next(error))
})

// deleting note

app.delete('/api/notes/:id', (request, response, next) => { 
  Note.findByIdAndDelete(request.params.id)
  .then(result=>{
    response.status(204).end()
  })
  .catch(error=>next(error))
})

app.use(unknownEndpoint)
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)


// port creation

const PORT = process.env.PORT
app.listen(PORT) //listen to request sent to {PORT}
console.log(`Server running on port ${PORT}`)