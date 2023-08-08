import * as api from '../api'

export const fetchPosition = () => async(dispatch) => {
    try {
        const { data } = await api.fetchPosition()

        dispatch({
            type: 'FETCH_POSITION',
            payload: data
        })
    } catch (error) {
        if(error.response)
            dispatch({
                type: 'POSITION_NOTFOUND',
                err: error.response.data
            })
        else
            dispatch({
                type: 'POSITION_NOTFOUND',
            })
    }
}

export const addPosition = (form) => async(dispatch) => {
    try {
        const { data } = await api.addPosition(form)

        dispatch({
            type: 'UPLOAD_POSITION',
            payload: data
        })
    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'SERVER_ERROR_UPLOADFAILED',
                err: {
                    message: 'Error 501: There was a problem uploading data in server, Please Try again later',
                    variant: 'danger'
                }
            })
    }
}

export const editPosition = (form) => async(dispatch) => {
    try {
        const { data } = await api.editPosition(form)

        dispatch({
            type: 'EDIT_POSITION',
            payload: data
        })
    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'SERVER_ERROR_UPLOADFAILED',
                err: {
                    message: 'Error 501: There was a problem uploading data in server, Please Try again later',
                    variant: 'danger'
                }
            })
    }
}

export const deletePosition = (id) => async(dispatch) => {
    try {
        const { data } = await api.deletePosition(id)

        dispatch({
            type: 'DELETE_POSITION',
            payload: data
        })
    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'SERVER_ERROR_UPLOADFAILED',
                err: {
                    message: 'Error 501: There was a problem uploading data in server, Please Try again later',
                    variant: 'danger'
                }
            })
    }
}

export const getCommenceYear = (year) => async(dispatch) => {
    try {
        const { data } = await api.getCommenceYear(year)

        dispatch({
            type: 'FETCH_COMMENCE_YEAR',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const getCommenceData = () => async(dispatch) => {
    try {
        const { data } = await api.getCommenceData()

        dispatch({
            type: 'FETCH_COMMENCE_DATA',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const uploadMessage = (form) => async(dispatch) => {
    try {
        const { data } = await api.uploadMessage(form)

        dispatch({
            type: 'UPLOAD_MESSAGE',
            payload: {
                entry: data.entry,
                message: data.message
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const editMessage = (form) => async(dispatch) => {
    try {
        const { data } = await api.editMessage(form)

        dispatch({
            type: 'EDIT_MESSAGE',
            payload: {
                entry: data.entry,
                message: data.message
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const deleteMessage = (id) => async(dispatch) => {
    try {
        const { data } = await api.deleteMessage(id)

        dispatch({
            type: 'DELETE_MESSAGE',
            payload: {
                entry: data.entry,
                message: data.message
            }
        })
    } catch (error) {
        console.log(error)
    }
}