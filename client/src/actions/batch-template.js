import * as api from '../api'


export const getBatchYear = () => async(dispatch) => {
    try {
        const { data } = await api.fetchBatchYear()
        dispatch({
            type: 'FETCH_BATCH_YEAR',
            payload: data
        })
    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'BATCH_ERROR',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    variant: 'danger',
                    heading: '500: Internal Server Error'
                }
            })
        else
            console.log(error)
    }
}

export const getTemplate = () => async(dispatch) => {
    try {
        const { data } = await api.fetchTemplate()
        dispatch({
            type: 'FETCH_TEMPLATE',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const getBanner = () => async(dispatch) => {
    try {
        const { data } = await api.fetchBanner()
        dispatch({
            type: 'FETCH_BANNER',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const getFrame = () => async(dispatch) => {
    try {
        const { data } = await api.fetchFrame()
        dispatch({
            type: 'FETCH_FRAME',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const getCover = () => async(dispatch) => {
    try {
        const { data } = await api.fetchCover()
        dispatch({
            type: 'FETCH_COVER',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const getNametags = () => async(dispatch) => {
    try {
        const { data } = await api.fetchNametags()
        dispatch({
            type: 'FETCH_NAMETAGS',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const getCategoryType = (type) => async(dispatch) => {
    try {
        const { data } = await api.getCategoryType(type)
        dispatch({
            type: 'FETCH_CATEGORY',
            payload: data
        })
    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'BATCH_ERROR',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    variant: 'danger',
                    heading: '500: Internal Server Error'
                }
            })
        else
            console.log(error)
    }
}


export const removeDesign = (obj) => async(dispatch) => {
    try {
        const { data } = await api.removeDesign(obj)
        dispatch({
            type: 'UPDATE_DESIGN',
            payload: {
                category: data.category,
                cover: data.cover,
                template: data.template,
                nametag: data.nametag
            }
        })
    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'BATCH_ERROR',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    variant: 'danger',
                    heading: '500: Internal Server Error'
                }
            })
        else
            console.log(error)
    }
}


export const uploadBatch = (batch) => async(dispatch) => {
    try {
        const { data } = await api.createBatchYear(batch)

        dispatch({
            type: 'CREATE_BATCH_YEAR',
            payload: data
        })

    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'BATCH_ERROR',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    variant: 'danger',
                    heading: '500: Internal Server Error'
                }
            })
        else
            console.log(error)
    }
}

export const editBatch = (batch, id) => async(dispatch) => {
    try {
        const { data } = await api.editBatchYear(batch, id)

        dispatch({
            type: 'EDIT_BATCH_YEAR',
            payload: data,
        })

    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'BATCH_ERROR',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    variant: 'danger',
                    heading: '500: Internal Server Error'
                }
            })
        else
            console.log(error)
    }
}

export const deleteBatchYear = (id) => async(dispatch) => {
    try {
        const { data } = await api.deleteBatchYear(id)

        dispatch({
            type: 'EDIT_BATCH_YEAR',
            payload: data,
        })

    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'BATCH_ERROR',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    variant: 'danger',
                    heading: '500: Internal Server Error'
                }
            })
        else
            console.log(error)
    }
}

export const uploadTemplate = (template) => async(dispatch) => {
    try {
        const { data } = await api.createTemplate(template)

        dispatch({
            type: 'CREATE_TEMPLATE',
            payload: {
                data: data.data,
                message: data.message, 
                variant: data.variant,
                heading: data.heading
            }
        })

    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'BATCH_ERROR',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    variant: 'danger',
                    heading: '500: Internal Server Error'
                }
            })
        else
            dispatch({
                type: 'BATCH_ERROR',
                    err: {
                        message: 'There was an error upon uploading templates, Please try again.',
                        variant: 'danger',
                        heading: '415: Unsupported Media Type'
                    }
                })
    }
}

export const uploadFrame = (frame) => async(dispatch) => {
    try {
        const { data } = await api.createFrame(frame)

        dispatch({
            type: 'CREATE_FRAME',
            payload: {
                data: data.data,
                message: data.message, 
                variant: data.variant,
                heading: data.heading
            }
        })

    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'BATCH_ERROR',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    variant: 'danger',
                    heading: '500: Internal Server Error'
                }
            })
        else
            dispatch({
                type: 'BATCH_ERROR',
                    err: {
                        message: 'There was an error upon uploading frame, Please try again.',
                        variant: 'danger',
                        heading: '415: Unsupported Media Type'
                    }
            })
    }
}

export const uploadBanner = (banner) => async(dispatch) => {
    try {
        const { data } = await api.createBanner(banner)

        dispatch({
            type: 'CREATE_BANNER',
            payload: {
                data: data.data,
                message: data.message, 
                variant: data.variant,
                heading: data.heading
            }
        })

    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'BATCH_ERROR',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    variant: 'danger',
                    heading: '500: Internal Server Error'
                }
            })
        else
            dispatch({
                type: 'BATCH_ERROR',
                    err: {
                        message: 'There was an error upon uploading banner, Please try again.',
                        variant: 'danger',
                        heading: '415: Unsupported Media Type'
                    }
            })
    }
}

export const uploadCover = (cover) => async(dispatch) => {
    try {
        const { data } = await api.createCover(cover)
        dispatch({
            type: 'CREATE_COVER',
            payload: {
                data: data.data,
                message: data.message, 
                variant: data.variant,
                heading: data.heading
            }
        })

    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'BATCH_ERROR',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    variant: 'danger',
                    heading: '500: Internal Server Error'
                }
            })
        else
            dispatch({
                type: 'BATCH_ERROR',
                    err: {
                        message: 'There was an error upon uploading cover pages, Please try again.',
                        variant: 'danger',
                        heading: '415: Unsupported Media Type'
                    }
            })
    }
}

export const uploadNametags = (nametags) => async(dispatch) => {
    try {
        const { data } = await api.createNametags(nametags)

        dispatch({
            type: 'CREATE_NAMETAGS',
            payload: {
                data: data.data,
                message: data.message, 
                variant: data.variant,
                heading: data.heading
            }
        })

    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'BATCH_ERROR',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    variant: 'danger',
                    heading: '500: Internal Server Error'
                }
            })
        else
            dispatch({
                type: 'BATCH_ERROR',
                    err: {
                        message: 'There was an error upon uploading nametag, Please try again.',
                        variant: 'danger',
                        heading: '415: Unsupported Media Type'
                    }
            })
    }
}

export const getCurrentYear = () => async(dispatch) => {
    try {
        const { data } = await api.fetchCurrentBatchYear()

        dispatch({
            type: 'FETCH_CURRENT_BATCHYEAR',
            payload: {
                year: data
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const checkYear = (year) => async(dispatch) => {
    try {
        const { data } = await api.checkYear(year)
        dispatch({
            type: 'CHECK_YEAR',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}