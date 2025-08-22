import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'
import PropTypes from 'prop-types'

const Anecdote = ({ anecdote, handleVote }) => {
    return (
        <div>
            <div>{anecdote.content}</div>
            has {anecdote.votes}
            <button onClick={handleVote}>vote</button>
        </div>
    )
}

const Anecdotes = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(({ filter, anecdotes }) => {
      if (!filter) {
        return anecdotes
      }
      return anecdotes.filter(a => 
        a.content.toLowerCase().includes(filter.toLowerCase())
      )
    })
    const byVotes = (a, b) => b.votes - a.votes

    const handleVote = (anecdote) => {
        const newObject = {...anecdote, votes: anecdote.votes + 1}
        dispatch(voteAnecdote(newObject))
        dispatch(showNotification(`You voted "${anecdote.content}"`, 5))
    }

    return(
      <div>
        {[...anecdotes].sort(byVotes).map(anecdote =>
          <Anecdote
            key={anecdote.id}
            anecdote={anecdote}
            handleVote={() => handleVote(anecdote)}
          />
        )}
      </div>
    )
}

Anecdote.propTypes = {
  anecdote: PropTypes.object.isRequired,
  handleVote: PropTypes.func.isRequired
}

export default Anecdotes