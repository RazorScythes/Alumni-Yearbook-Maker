import * as api from '../api'

export const changePassword = (form, id) => async(dispatch) => {
    try {
        const { data } = await api.changePassword(form, id)

        dispatch({
            type: 'CHANGE_PASSWORD',
            payload: {
                message: data.message, 
                variant: data.variant,
                heading: data.heading
            }
        })
    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'WRONG_CREDENTIALS',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    variant: 'danger',
                    heading: '402 Error'
                }
            })
        else
            dispatch({
                type: 'WRONG_CREDENTIALS',
                payload: {
                    message: error.response.data.message,
                    variant: error.response.data.variant,
                    heading: error.response.data.heading
                }
            })
    }
}

export const updateName = (form) => async(dispatch) => {
    try {
        const { data } = await api.updateName(form)

        dispatch({
            type: 'CHANGE_NAME',
            payload: {
                message: data.message, 
                variant: data.variant,
                heading: data.heading
            }
        })
    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'WRONG_CREDENTIALS',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    variant: 'danger',
                    heading: '402 Error'
                }
            })
        else
            dispatch({
                type: 'WRONG_CREDENTIALS',
                payload: {
                    message: error.response.data.message,
                    variant: error.response.data.variant,
                    heading: error.response.data.heading
                }
            })
    }
}