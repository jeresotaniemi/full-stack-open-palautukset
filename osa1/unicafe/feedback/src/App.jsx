import { useState } from 'react'

// komponentti otsikoille
const Header = (props) => {
  return (
    <div>
      <h2>{props.header}</h2>
    </div>
  )
}

// komponentti napeille
const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

// komponentti tilastoriveille
const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}:</td> 
      <td>{value}</td>
    </tr>
  )
}

// komponentti tilojen näyttämiselle
const Statistics = ({ good, neutral, bad, all }) => {
  if (all === 0) {
    return <p>No feedback given!</p>
  }

  const average = (good * 1 + neutral * 0 + bad * -1) / all
  const positive = (good / all) * 100

  return (
    <table>
      <tbody>
        <StatisticLine text='Good' value={good} />
        <StatisticLine text='Neutral' value={neutral} />
        <StatisticLine text='Bad' value={bad} />
        <StatisticLine text='All' value={all} />
        <StatisticLine text='Average' value={average}  />
        <StatisticLine text='Positive' value={positive + '%'} />
      </tbody>
    </table>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)

  // tallenna otsikot
  const header1 = "Give Feedback"
  const header2 = "Statistics"

  // tallenna tilan päivitykset omiin funktioihin
  const handleGoodClick = () => { 
    const updatedGood = good + 1
    setGood(updatedGood)
    setAll(updatedGood + neutral + bad)
  }
  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    setAll(good + updatedNeutral + bad)
  }
  const handleBadClick = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
    setAll(good + neutral+ updatedBad)
  }

  return (
    <div>
      <Header header={header1} />
      <Button onClick={handleGoodClick} text='Good' />
      <Button onClick={handleNeutralClick} text='Neutral' />
      <Button onClick={handleBadClick} text='Bad' />

      <Header header={header2} />
      <Statistics good={good} neutral={neutral} bad={bad} all={all} />

    </div>
  )
}

export default App