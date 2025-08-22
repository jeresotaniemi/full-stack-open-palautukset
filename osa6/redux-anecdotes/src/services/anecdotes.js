import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response  = await axios.get(baseUrl)
    return response.data
}

const createNew = async (content) => {
    const object = { content, votes: 0 }
    const response = await axios.post(baseUrl, object)
    return response.data
}
const addVote = async (votedObject) => {
    const request = axios.put(`${baseUrl}/${votedObject.id}`, votedObject)
    return request.then(response => response.data)
}

export default { getAll, createNew, addVote }