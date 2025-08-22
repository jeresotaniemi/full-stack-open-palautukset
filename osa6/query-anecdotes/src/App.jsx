import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, voteAnecdote } from './requests'
import { NotificationContextProvider } from './NotificationContext'
import { useDispatch } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  const votedAnecdoteMutation = useMutation(
    {mutationFn: voteAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes']})
    }
  })

  const handleVote = (anecdote) => {
    votedAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
    dispatch({
      type: 'SET_NOTIFICATION',
      payload: `You voted "${anecdote.content}"`
    })
    setTimeout(() => dispatch({
      type: 'CLEAR_NOTIFICATION'
    }), 5000)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })
  console.log(JSON.parse(JSON.stringify(result)))

  if ( result.isPending ) {
    return <div>Loading...</div>
  }

  if ( result.isError ) {
    return <div>Anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  if ( !anecdotes ) {
    return null
  }

  const byVotes = (a, b) => b.votes - a.votes

  return (
    <div>
      <h3>Anecdote app</h3>
      
      <Notification />
      <AnecdoteForm />
      
      {[...anecdotes].sort(byVotes).map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
