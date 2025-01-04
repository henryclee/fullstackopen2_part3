const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.json())


morgan.token('content', function getContent(req, res) {
    return (JSON.stringify(req.body))
})

app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :content`))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateID = () => {
    const id = Math.floor(Math.random() * 100)
    return (String(id))
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Missing name and or number'
        })
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: `${body.name} is already in the phonebook`
        })
    }
    
    const person = {
        id : generateID(),
        name : body.name,
        number : body.number
    }

    persons = persons.concat(person)
    return response.json(person)

})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})


app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {

    resp = `
    <div>
    <p>Phone has info for ${persons.length} people</p>
    <p>${Date()}</p>
    </div>
    `
    response.send(resp)
})


app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})