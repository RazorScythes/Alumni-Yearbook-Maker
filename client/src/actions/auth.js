import * as api from '../api'

export const SignIn = (formData, history) => async(dispatch) => {
    try {
        const { data } = await api.SignIn(formData)

        dispatch({
            type: 'AUTH',
            data
        })

    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'AUTH_ERROR',
                err: "There was a problem with the server"
            })
        else
            dispatch({
                type: 'AUTH_ERROR',
                err: error.response.data.message
            })
    }
}


export const ResetPassword = (email) => async(dispatch) => {
    try {
        const { data } = await api.ResetPassword(email)

        dispatch({
            type: 'RESET_VERIFICATION_SENT',
            data: { message: "ok" }
        })

    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'AUTH_ERROR',
                err: "There was a problem with the server"
            })
        else
            dispatch({
                type: 'EMAIL_NOT_FOUND',
                err: error.response.data.message
            })
    }
}

export const checkResetConfirmation = (id) => async(dispatch) => {
    try {
        const { data } = await api.checkResetConfirmation(id)

        dispatch({
            type: 'CHECK_RESET_CONFIRMATION',
            data: { message: "ok" }
        })

    } catch(error) {
        if(!error.response)
            dispatch({
                type: 'AUTH_ERROR',
                err: {
                    message: 'There was a problem in the server, Please try again later',
                }
            })
        else 
            dispatch({
                type: 'AUTH_ERROR',
                err: error.response.data
            })
    }
}


export const newPassword = (form) => async(dispatch) => {
    try {
        const { data } = await api.newPassword(form)

        dispatch({
            type: 'NEW_PASSWORD',
            data: { message: "ok" }
        })

    } catch(error) {
        if(!error.response)
            dispatch({
                type: 'AUTH_ERROR',
                err: {
                    message: 'There was a problem in the server, Please try again later',
                }
            })
        else 
            dispatch({
                type: 'AUTH_ERROR',
                err: error.response.data
            })
    }
}