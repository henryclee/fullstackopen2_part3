require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(cors())

app.use(express.static('dist'))

morgan.token('content', function getContent(req, res) {
    return (JSON.stringify(req.body))
})

app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :content`))

const errorHandler = (error, request, response, next) => {

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
      }

    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }


app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(id, person, {new: true})
        .then((updatedPerson) => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})


app.get('/api/persons', (request, response, next) => {

    Person.find({})
        .then((result) => {
            response.json(result)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findById(id)
        .then(person =>{
            response.json(person)
        })
        .catch(error => next(error))

})

app.get('/info', (request, response) => {

    Person.collection.countDocuments()
        .then(result => {
            resp = `
                <div>
                <p>Phone has info for ${result} people</p>
                <p>${Date()}</p>
                </div>
                `
            response.send(resp)
        })

})


app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))

})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})