import { useState } from 'react'

const Header = ({ header }) => <h1>{header}</h1>

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const Anecdote = ({ anecdotes, index, votes }) => {
  if (votes === 1) {
    return (
      <div>
        <p>{anecdotes[index]}</p>
        <p>Has {votes} vote</p>
      </div>
    )
  }
  return (
    <div>
      <p>{anecdotes[index]}</p>
      <p>Has {votes} votes</p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  // muuta aloitustila satunnaiseksi
  const randomstart = Math.floor(Math.random() * anecdotes.length)
  const [selected, setSelected] = useState(() => randomstart)

  // luo uusi tila, jonka aloitustila on tyhjä taulukko
  const[votes, setVotes] = useState(() => new Array(anecdotes.length).fill(0))

  // tallenna tilanpäivitys omaan funktioon
  const handleNextClick = () => {
    const random = Math.floor(Math.random() * anecdotes.length)
    setSelected(random)
  }

  const handleVoteClick = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  const header1 = 'Anecdote of the day'
  const header2 = 'Anecdote with most votes'

  const mostVotes = Math.max(...votes)
  const mostVoted = votes.indexOf(mostVotes)


  return (
    <div>
      <Header header={header1} />
      <Anecdote anecdotes={anecdotes} index={selected} votes={votes[selected]}/>
      <Button onClick={handleVoteClick} text='Vote' />
      <Button onClick={handleNextClick} text='Next Anecdote' />

      <Header header={header2} />
      <Anecdote anecdotes={anecdotes} index={mostVoted} votes={mostVotes}/>
    </div>
  )
}

export default App