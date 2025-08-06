const CountryDetails = ({ country }) => {
    return (
        <div>
            <h2>{country.name.common}</h2>
                <p>Capital: {country.capital}</p>
                <p>Area: {country.area}</p>

                <h3>Languages</h3>
                <ul>
                    {country.languages 
                        ? Object.values(country.languages).map(language =>  (
                            <li key={language}>{language}</li>
                        ))
                        : <li>No languages available</li>
                    }
                </ul>
                <img src={country.flags.png} />
        </div>
    )
}

export default CountryDetails;