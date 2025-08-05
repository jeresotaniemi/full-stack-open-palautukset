import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, type: '' })

  useEffect(() => {
    personService
      .getAll()
        .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleDelete = id => {
    const person = persons.find(p => p.id === id)

    if (window.confirm(`Delete ${person.name} ?`)) {
    
      personService
      .deletePerson(id).then(returnedPerson => {
        setPersons(persons.filter(p => p.id !== id))
      })
      .catch(error => {
        alert(
          `The person '${person.name}' was already deleted from server`
        )
        setPersons(persons.filter(p => p.id !== id))
      })

      setNotification({ message: `Deleted ${person.name} from the phonebook`, type: 'success' })
      setTimeout(() => {
        setNotification({ message: null, type: '' })
      }, 5000)
    }
  }

  const addInfo = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name === newName)) {
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName)
        const updatedPerson = { ...person, number: newNumber }
        
        personService
          .update(person.id, updatedPerson).then(returnedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setNotification({ message: `Information of ${person.name} has already been removed from server`, type: 'error' })
          })
        setNotification({ message: `Updated ${person.name}'s number to ${newNumber}`, type: 'success' })
        setTimeout(() => {
          setNotification({ message: null, type: '' })
        }, 5000)
      }
      return
    }

    const infoObject = {
      name: newName, 
      number: newNumber,
    }

    personService
      .create(infoObject)
      .then(returnedNote => {
        setPersons(persons.concat(returnedNote))
        setNewName('')
        setNewNumber('')
      })

    setNotification({ message: `Added ${newName} to the phonebook`, type: 'success' })
    setTimeout(() => {
      setNotification({ message: null, type: '' })
    }, 5000)
  }

  const handleNameChange = (event) => setNewName(event.target.value)

  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleFilterChange = (event) => setFilter(event.target.value)
  
  const personsToShow = filter === ' '
    ? persons
    : persons.filter(person => 
        person.name.toLowerCase().includes(filter.toLowerCase())
      )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter filter={filter} handleFilter={handleFilterChange}/>
      <h3>Add a new</h3>
      <PersonForm newName={newName} newNumber={newNumber} handleName={handleNameChange} handleNumber={handleNumberChange} addInfo={addInfo} />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )

}

export default App