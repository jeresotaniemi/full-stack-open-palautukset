import {useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  // Fetch all countries data from the API
  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => {
        console.error('Error fetching countries data:', error)
      })
  }, [])

  // Handlers for search input and show button
  const handleSearchChange = (event) => setSearch(event.target.value)
  const handleShowButtonClick = (countryName) => {
    setSearch(countryName)
  }

  // Filter countries based on search input
  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      Find countries <input value={search} onChange={handleSearchChange} />
      <Countries countries={filteredCountries} handleShowButtonClick={handleShowButtonClick} />
    </div>
  )
}

export default App
