const Persons = ({ personsToShow, handleDelete }) => {
  return(
    <div>
      {personsToShow.map(person =>
        <li key={person.name}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </li>
      )}
    </div>
  )
}

export default Persons;