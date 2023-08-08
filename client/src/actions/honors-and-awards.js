import * as api from '../api'

export const addHonorTitle = (form) => async(dispatch) => {
    try {
        const { data } = await api.addHonorTitle(form)

        dispatch({
            type: 'UPLOAD_HONOR_TITLE',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const editHonorTitle = (form) => async(dispatch) => {
    try {
        const { data } = await api.editHonorTitle(form)

        dispatch({
            type: 'EDIT_HONOR_TITLE',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const deleteHonorTitle = (form) => async(dispatch) => {
    try {
        const { data } = await api.deleteHonorTitle(form)

        dispatch({
            type: 'DELETE_HONOR_TITLE',
            payload: data
        })
    } catch (error) {
        if(error.response)
            dispatch({
                type: 'HA_NOTFOUND',
                err: error.response.data
            })
    }
}

export const getHAYear = () => async(dispatch) => {
    try {
        const { data } = await api.getHAYear()

        dispatch({
            type: 'FETCH_HA_YEAR',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const getHA = (year) => async(dispatch) => {
    try {
        const { data } = await api.getHA(year)

        dispatch({
            type: 'FETCH_HA',
            payload: data
        })
    } catch (error) {
        if(error.response)
            dispatch({
                type: 'HA_NOTFOUND',
                err: error.response.data
            })
    }
}

export const uploadHA = (post) => async(dispatch) => {
    try {
        const { data } = await api.uploadHA(post)

        dispatch({
            type: 'UPLOAD_HA',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateHA = (post) => async(dispatch) => {
    try {
        const { data } = await api.updateHA(post)

        dispatch({
            type: 'UPDATE_HA',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const deleteHA = (post) => async(dispatch) => {
    try {
        const { data } = await api.deleteHA(post)

        dispatch({
            type: 'DELETE_HA',
            payload: {
                entry: data.entry,
                message: data.message
            }
        })
    } catch (error) {
        console.log(error)
    }
}