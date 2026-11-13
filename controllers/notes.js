const notesRouter = require('express').Router() //performs middleware and routing functions
const Note = require('../models/note')

// getting the notes
//response.send('<h1>Hello World!</h1>') //express automatically sets value to text/html

notesRouter.get('/', async (request, response) => { //handle request made at root
  const notes = await Note.find({})
      response.json(notes) //sends notes array as a json string; sets value as notesRouterlication/json
  })

notesRouter.get('/:id', async (request, response, next) => { //route for a specific note
  const note = await Note.findById(request.params.id)
  if(note){
  response.json(note)
  } else {
    response.status(404).end() //change status if note not found
  }
})

// creating note
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({ //using the MDB schema
    content: body.content,
    important: body.important || false, //if missing; default to missing
  })

  const savedNote = await note.save()
  response.status(201).json(savedNote)
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

notesRouter.delete('/:id', async (request, response, next) => { 
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
  })

module.exports = notesRouter