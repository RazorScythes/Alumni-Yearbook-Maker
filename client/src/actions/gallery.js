import * as api from '../api'


export const getAllYear = () => async(dispatch) => {
    try {
        const { data } = await api.getAllYear()
        dispatch({
            type: 'GALLERY_YEAR',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const getLatestGallery = () => async(dispatch) => {
    try {
        const { data } = await api.getLatestGallery()
        dispatch({
            type: 'GALLERY',
            payload: data
        })
    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'GALLERY_ERROR',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    variant: 'danger',
                    heading: '500: Internal Server Error'
                }
            })
        else 
            dispatch({
                type: 'GALLERY_ERROR',
                err: error.response.data
            })
    }
}

export const getGallery = (id) => async(dispatch) => {
    try {
        const { data } = await api.getGallery(id)
        dispatch({
            type: 'GALLERY',
            payload: data
        })
    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'GALLERY_ERROR',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    variant: 'danger',
                    heading: '500: Internal Server Error'
                }
            })
        else {
            dispatch({
                type: 'GALLERY_ERROR',
                err: error.response.data
            })
            dispatch({
                type: 'EMPTY_GALLERY',
            })
        }
    }
}   

export const uploadOnDrop = (images) => async(dispatch) => {
    try {
        const { data } = await api.uploadOnDrop(images)
        dispatch({
            type: 'GALLERY_UPLOAD',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const removeImage = (id) => async(dispatch) => {
    try {
        const { data } = await api.removeImage(id)
        dispatch({
            type: 'DELETE_IMAGE',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}