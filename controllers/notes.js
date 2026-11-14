const notesRouter = require('express').Router() //performs middleware and routing functions
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// getting the notes
//response.send('<h1>Hello World!</h1>') //express automatically sets value to text/html

notesRouter.get('/', async (request, response) => { //handle request made at root
  const notes = await Note.find({})
      response.json(notes) //sends notes array as a json string; sets value as notesRouterlication/json
  })

notesRouter.get('/:id', async (request, response) => { //route for a specific note
  const note = await Note.findById(request.params.id)
  if(note){
  response.json(note)
  } else {
    response.status(404).end() //change status if note not found
  }
})

// creating note
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

notesRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }


  const note = new Note({ //using the MDB schema
    content: body.content,
    important: body.important || false, //if missing; default to missing
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  response.status(201).json(savedNote)
})

//updating note

notesRouter.put('/:id', async (request, response) => {
  const { content, important } = request.body

  const note = await Note.findById(request.params.id)
  if (!note){
    return response.status(404).end()
  }
  note.content = content
  note.important = important

  const updatedNote = await note.save()
  response.json(updatedNote)
    })

// deleting note

notesRouter.delete('/:id', async (request, response, next) => { 
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
  })

module.exports = notesRouter