import * as api from '../api'

export const confirmDeletion = (password) => async(dispatch) => {
    try {
        const { data } = await api.confirmDeletion(password)

        dispatch({
            type: 'DELETE_ACCOUNT',
            payload: data
        })
    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'ACCOUNT_CONFIRMATION_ERROR',
                err: {
                    err_message: 'Something went wrong to the server, please try again later',
                }
            })
        else
            dispatch({
                type: 'ACCOUNT_CONFIRMATION_ERROR',
                err: error.response.data
            })
    }
}

export const sendGmail = (email) => async(dispatch) => {
    try {
        const { data } = await api.sendGmail(email)

        dispatch({
            type: 'GMAIL_SENT',
            payload: data
        })

    } catch (error) {
        console.log(error)
    }
}

export const getAccountRole = () => async(dispatch) => {
    try {
        const { data } = await api.getAccountRole()

        dispatch({
            type: 'FETCH_ACCOUNT_ROLE',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const getAccounts = (role) => async(dispatch) => {
    try {
        const { data } = await api.getAccounts(role)

        dispatch({
            type: 'FETCH_ACCOUNTS',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateAccount = (role) => async(dispatch) => {
    try {
        const { data } = await api.updateAccount(role)

        dispatch({
            type: 'UPDATE_ACCOUNT',
            payload: {
                entry: data.entry,
                message: data.message
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const uploadAccount = (role) => async(dispatch) => {
    try {
        const { data } = await api.uploadAccount(role)

        dispatch({
            type: 'UPLOAD_ACCOUNT',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const deleteAccount = (post) => async(dispatch) => {
    try {
        const { data } = await api.deleteAccount(post)

        dispatch({
            type: 'DELETE_ACCOUNT',
            payload: {
                entry: data.entry,
                message: data.message
            }
        })
    } catch (error) {
        console.log(error)
    }
}