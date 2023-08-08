import * as api from '../api'

export const getAllMessage = () => async(dispatch) => {
    try {
        const { data } = await api.getAllMessage()

        dispatch({
            type: 'FETCH_MESSAGE',
            payload: data
        })
    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'INBOX_ERROR',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    variant: 'danger',
                    heading: '500: Internal Server Error'
                }
            })
        else 
            dispatch({
                type: 'INBOX_ERROR',
                err: error.response.data
            })
    }
}

export const updateAllMessage = (arr) => async(dispatch) => {
    try {
        const { data } = await api.updateAllMessage(arr)

        dispatch({
            type: 'UPDATE_MESSAGE',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const replyMessage = (form) => async(dispatch) => {
    try {
        const { data } = await api.replyMessage(form)

        dispatch({
            type: 'REPLY_MESSAGE',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const removeMessage = (form) => async(dispatch) => {
    try {
        const { data } = await api.removeMessage(form)

        dispatch({
            type: 'REMOVE_MESSAGE',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}