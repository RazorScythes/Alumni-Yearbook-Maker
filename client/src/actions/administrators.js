import * as api from '../api'

export const addAdministration = (title) => async(dispatch) => {
    try {
        const { data } = await api.addAdministration(title)

        dispatch({
            type: 'ADD_ADMINISTRATION',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const editAdministration = (title) => async(dispatch) => {
    try {
        const { data } = await api.editAdministration(title)

        dispatch({
            type: 'EDIT_ADMINISTRATION',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}


export const deleteAdministration = (form) => async(dispatch) => {
    try {
        const { data } = await api.deleteAdministration(form)

        dispatch({
            type: 'DELETE_ADMINISTRATION',
            payload: data
        })
    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'ADMINISTRATORS_ERROR',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    variant: 'danger',
                    heading: '500: Internal Server Error'
                }
            })
        else 
            dispatch({
                type: 'ADMINISTRATORS_ERROR',
                err: error.response.data
            })
    }
}

export const getAdministration = (title) => async(dispatch) => {
    try {
        const { data } = await api.addAdministration(title)

        dispatch({
            type: 'FETCH_ADMINISTRATION',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const getAdminYear = () => async(dispatch) => {
    try {
        const { data } = await api.getAdminYear()

        dispatch({
            type: 'FETCH_ADMIN_YEAR',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const getLatestContent = (content) => async(dispatch) => {
    try {
        const { data } = await api.getLatestContent(content)

        dispatch({
            type: 'FETCH_ADMINISTRATORS',
            payload: data
        })
    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'ADMINISTRATORS_ERROR',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    variant: 'danger',
                    heading: '500: Internal Server Error'
                }
            })
        else 
            dispatch({
                type: 'ADMINISTRATORS_ERROR',
                err: error.response.data
            })
    }
}

export const getAdminContent = (content) => async(dispatch) => {
    try {
        const { data } = await api.getAdminContent(content)

        dispatch({
            type: 'FETCH_ADMINISTRATORS',
            payload: data
        })
    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'ADMINISTRATORS_ERROR',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    variant: 'danger',
                    heading: '500: Internal Server Error'
                }
            })
        else 
            dispatch({
                type: 'ADMINISTRATORS_ERROR',
                err: error.response.data
            })
    }
}

export const getAdministrators = (year) => async(dispatch) => {
    try {
        const { data } = await api.getAdministrators(year)

        dispatch({
            type: 'FETCH_ADMINISTRATORS',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const uploadAdministrators = (post) => async(dispatch) => {
    try {
        const { data } = await api.uploadAdministrators(post)

        dispatch({
            type: 'UPLOAD_ADMINISTRATORS',
            payload: data
        })
    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'UPLOAD_ERROR',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    variant: 'danger',
                    heading: '500: Internal Server Error'
                }
            })
        else 
            dispatch({
                type: 'UPLOAD_ERROR',
                err: error.response.data
            })
    }
}

export const updateAdministrators = (post) => async(dispatch) => {
    try {
        const { data } = await api.updateAdministrators(post)

        dispatch({
            type: 'UPDATE_ADMINISTRATORS',
            payload: {
                entry: data.entry,
                message: data.message
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const deleteAdministrators = (post) => async(dispatch) => {
    try {
        const { data } = await api.deleteAdministrators(post)

        dispatch({
            type: 'DELETE_ADMINISTRATORS',
            payload: {
                entry: data.entry,
                message: data.message
            }
        })
    } catch (error) {
        console.log(error)
    }
}