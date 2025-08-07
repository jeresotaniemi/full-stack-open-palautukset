const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.static('dist'))

let persons= [
    {
        id: "1", 
        name: "Arto Hellas", 
        number: "040-1234567"
    },
    {
        id: "2", 
        name: "Ada Lovelace", 
        number: "39-44-5323523"
    },
    {
        id: "3", 
        name: "Dan Abramov", 
        number: "12-43-234345"
    },
    {
        id: "4", 
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
    }
]

morgan.token('body', (request, response) => {
    return JSON.stringify(request.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date()
    const info = `<p>Phonebook has info for ${persons.length} people</p>
                  <p>${date}</p>`
    response.send(info)
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

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const randomId = (Math.random() * 1000).toFixed(0)
    return randomId.toString()
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})