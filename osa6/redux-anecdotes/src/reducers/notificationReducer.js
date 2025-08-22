import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice ({
    name: 'notification',
    initialState: '',
    reducers: {
        setNotification(state, action) {
            const notification = action.payload
            return notification
        }
    }
})

export const { setNotification, clearNotification } = notificationSlice.actions

export const showNotification = (message, seconds) => {
    return dispatch => {
        dispatch(setNotification(message))
        setTimeout(() => {
            dispatch(setNotification(''))
        }, seconds * 1000)
    }
}

export default notificationSlice.reducer