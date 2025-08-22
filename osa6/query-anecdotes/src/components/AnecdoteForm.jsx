import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes']})
    },
    onError: (error) => {
      dispatch({
      type: 'SET_NOTIFICATION',
      payload: 'Too short anecdote, must have length 5 or more'
    })
    setTimeout(() => dispatch({
      type: 'CLEAR_NOTIFICATION'
    }), 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0})
    dispatch({
      type: 'SET_NOTIFICATION',
      payload: `Anecdote "${content}" added`
    })
    setTimeout(() => dispatch({
      type: 'CLEAR_NOTIFICATION'
    }), 5000)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
