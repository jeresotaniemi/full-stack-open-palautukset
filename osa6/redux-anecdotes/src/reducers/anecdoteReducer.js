import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteToLike = state.find(a => a.id === id)
      const likedAnecdote = {...anecdoteToLike, votes: anecdoteToLike.votes + 1}
      return state.map(a => a.id !== id ? a : likedAnecdote)
    },
    appendAnecdote(state,action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    updateAnecdote(state, action) {
      const updated = action.payload
      return state.map(a => a.id !== updated.id ? a : updated)
    }
  }
})

export const { appendAnecdote, setAnecdotes, updateAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (votedObject) => {
  return async dispatch => {
    const votedAnecdote = await anecdoteService.addVote(votedObject)
    dispatch(updateAnecdote(votedAnecdote))
  }
}

export default anecdoteSlice.reducer