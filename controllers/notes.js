const notesRouter = require('express').Router() //performs middleware and routing functions
const Note = require('../models/note')

// getting the notes
//response.send('<h1>Hello World!</h1>') //express automatically sets value to text/html

notesRouter.get('/', (request, response) => { //handle request made at root
  Note.find({}).then(notes=>{
      response.json(notes) //sends notes array as a json string; sets value as notesRouterlication/json
  }) 
})

notesRouter.get('/:id', (request, response, next) => { //route for a specific note
  Note.findById(request.params.id).then(note=>{
  if(note){
  response.json(note)
  } else {
    response.status(404).end() //change status if note not found
  }
})
.catch(error=> next(error))}) //if promise is rejected; passes error to express

// creating note
notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({ //using the MDB schema
    content: body.content,
    important: body.important || false, //if missing; default to missing
  })
  note.save().then((savedNote)=>{
    response.json(savedNote)
  })
  .catch(error=>next(error))
})

//updating note

notesRouter.put('/:id', (request, response, next) => {
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

notesRouter.delete('/:id', (request, response, next) => { 
  Note.findByIdAndDelete(request.params.id)
  .then(result=>{
    response.status(204).end()
  })
  .catch(error=>next(error))
})

module.exports = notesRouter