import CountryList from "./CountryList"
import CountryDetails from "./CountryDetails"
import Weather from "./Weather"

const Countries = ({ countries, handleShowButtonClick }) => {
    if (countries.length > 10) {
        return <div>Too many matches, specify another filter</div>
    }

    if (countries.length < 10 && countries.length > 1) {
        return (
            <CountryList countries={countries} handleShowButtonClick={handleShowButtonClick} />
        )
    }
    if (countries.length === 1) {
        const country = countries[0]
        return (
            <div>
                <CountryDetails country={country} />
                <Weather capital={country.capital} />
            </div>
        )
    }
}

export default Countries;