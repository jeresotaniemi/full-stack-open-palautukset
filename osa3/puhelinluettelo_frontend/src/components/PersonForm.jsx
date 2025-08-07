const PersonForm = ({ newName, newNumber, handleName, handleNumber, addInfo }) => {
  return(
    <form onSubmit={addInfo}>
        <div>
          Name: <input 
          value={newName}
          onChange={handleName}/>
        </div>
        <div>
          Number: <input 
          value={newNumber}
          onChange={handleNumber}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

export default PersonForm;