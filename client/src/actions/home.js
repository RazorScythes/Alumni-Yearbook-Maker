import * as api from '../api'
export const getHomeContent = (year) => async(dispatch) => {
    try {
        const { data } = await api.getHomeContent(year)

        dispatch({
            type: 'HOME_CONTENT',
            payload: data
        })

    } catch (error) {
        console.log(error)
    }
}

export const getAcademicYear = () => async(dispatch) => {
    try {
        const { data } = await api.getAcademicYear()

        dispatch({
            type: 'YEAR_HEADER',
            payload: data
        })

    } catch (error) {
        console.log(error)
    }
}

export const getGraduates = (id) => async(dispatch) => {
    try {
        const { data } = await api.getGraduates(id)

        dispatch({
            type: 'GRADUATES',
            payload: data
        })

    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'GRADUATE_ERROR',
                err: {
                    message: '500: Internal Server Error',
                    additional: 'There was a problem in the server, Please try again later',
                }
            })
        else 
            dispatch({
                type: 'GRADUATE_ERROR',
                err: error.response.data
                // err: {
                //     message: '404: No Data Available',
                //     additional: 'Looks like there was no data yet has been inserted',
                // }
            })
    }
}

export const searchQuery = (keyword) => async(dispatch) => {
    try {
        const { data } = await api.searchQuery(keyword)

        dispatch({
            type: 'HOME_SEARCH',
            payload: data
        })

    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'SEARCH_ERROR',
            })
        else 
            dispatch({
                type: 'SEARCH_ERROR',
            })
    }
}

export const getQuery = (keyword) => async(dispatch) => {
    try {
        const { data } = await api.getQuery(keyword)

        dispatch({
            type: 'HOME_QUERY',
            payload: data
        })

    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'SEARCH_ERROR',
            })
        else 
            dispatch({
                type: 'SEARCH_ERROR',
            })
    }
}

export const getCommence = (id) => async(dispatch) => {
    try {
        const { data } = await api.getCommence(id)

        dispatch({
            type: 'COMMENCE_DATA',
            payload: data
        })

    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'PROFILE_ERROR',
                err: {
                    message: '500: Internal Server Error',
                    additional: 'There was a problem in the server, Please try again later',
                }
            })
        else 
            dispatch({
                type: 'PROFILE_ERROR',
                err: error.response.data
            })
    }
}

export const getBatchGallery = (id) => async(dispatch) => {
    try {
        const { data } = await api.getBatchGallery(id)

        dispatch({
            type: 'GALLERY_DATA',
            payload: data
        })

    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'PROFILE_ERROR',
                err: {
                    message: '500: Internal Server Error',
                    additional: 'There was a problem in the server, Please try again later',
                }
            })
        else 
            dispatch({
                type: 'PROFILE_ERROR',
                err: error.response.data
            })
    }
}

export const getAlumniProfile = (id) => async(dispatch) => {
    try {
        const { data } = await api.getAlumniProfile(id)

        dispatch({
            type: 'ALUMNI_PROFILE',
            payload: data
        })

    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'PROFILE_ERROR',
                err: {
                    message: '500: Internal Server Error',
                    additional: 'There was a problem in the server, Please try again later',
                }
            })
        else 
            dispatch({
                type: 'PROFILE_ERROR',
                err: error.response.data
            })
    }
}

export const getDownloads = (id) => async(dispatch) => {
    try {
        const { data } = await api.getDownloads(id)

        dispatch({
            type: 'ALUMNI_DOWNLOADS',
            payload: data
        })

    } catch(error) {
        console.log(error)
    }
}

export const getEvent = (id) => async(dispatch) => {
    try {
        const { data } = await api.getEvent(id)

        dispatch({
            type: 'HOME_EVENT',
            payload: data
        })

    } catch(error) {
        if(!error.response)
            dispatch({
                type: 'PROFILE_ERROR',
                err: {
                    message: '500: Internal Server Error',
                    additional: 'There was a problem in the server, Please try again later',
                }
            })
        else 
            dispatch({
                type: 'PROFILE_ERROR',
                err: error.response.data
            })
    }
}

export const getNew = (id) => async(dispatch) => {
    try {
        const { data } = await api.getNew(id)

        dispatch({
            type: 'HOME_NEWS',
            payload: data
        })

    } catch(error) {
        if(!error.response)
            dispatch({
                type: 'PROFILE_ERROR',
                err: {
                    message: '500: Internal Server Error',
                    additional: 'There was a problem in the server, Please try again later',
                }
            })
        else 
            dispatch({
                type: 'PROFILE_ERROR',
                err: error.response.data
            })
    }
}

export const getAllEvent = (keyword) => async(dispatch) => {
    try {
        const { data } = await api.getAllEvent(keyword)

        dispatch({
            type: 'HOME_ALL_EVENT',
            payload: data
        })

    } catch(error) {
        if(!error.response)
            dispatch({
                type: 'PROFILE_ERROR',
                err: {
                    message: 'Something wrong with the server, please try again later',
                }
            })
        else 
            dispatch({
                type: 'PROFILE_ERROR',
                err: error.response.data
            })
    }
}

export const getOrderData = (id) => async(dispatch) => {
    try {
        const { data } = await api.getOrderData(id)

        dispatch({
            type: 'HOME_ORDER',
            payload: data
        })

    } catch(error) {
        if(!error.response)
            dispatch({
                type: 'PROFILE_ERROR',
                err: {
                    message: '500: Internal Server Error',
                    additional: 'There was a problem in the server, Please try again later',
                }
            })
        else 
            dispatch({
                type: 'PROFILE_ERROR',
                err: error.response.data
            })
    }
}

export const preOrder = (id) => async(dispatch) => {
    try {
        const { data } = await api.preOrder(id)

        dispatch({
            type: 'HOME_ORDER',
            payload: data
        })

    } catch(error) {
        console.log(error)
    }
}

export const cancelOrder = (id) => async(dispatch) => {
    try {
        const { data } = await api.cancelOrder(id)

        dispatch({
            type: 'HOME_ORDER',
            payload: data
        })

    } catch(error) {
        console.log(error)
    }
}

export const changeAlumniPassword = (form) => async(dispatch) => {
    try {
        const { data } = await api.changeAlumniPassword(form)

        dispatch({
            type: 'HOME_CHANGE_PASSWORD',
            payload: data
        })

    } catch(error) {
        if(!error.response)
            dispatch({
                type: 'HOME_CHANGE_PASSWORD',
                payload: {
                    message: '500: There was a problem with the server, please try again later',
                    variant: 'danger'
                }
            })
        else 
            dispatch({
                type: 'HOME_CHANGE_PASSWORD',
                payload: error.response.data
            })
    }
}

export const changeEmail = (form) => async(dispatch) => {
    try {
        const { data } = await api.changeEmail(form)

        dispatch({
            type: 'HOME_CHANGE_PASSWORD',
            payload: data
        })

    } catch(error) {
        if(!error.response)
            dispatch({
                type: 'HOME_CHANGE_PASSWORD',
                payload: {
                    message: '500: There was a problem with the server, please try again later',
                    variant: 'danger'
                }
            })
        else 
            dispatch({
                type: 'HOME_CHANGE_PASSWORD',
                payload: error.response.data
            })
    }
}


export const newMessage = (form) => async(dispatch) => {
    try {
        const { data } = await api.newMessage(form)

        dispatch({
            type: 'NEW_TICKET_MESSAGE',
            payload: data
        })

    } catch(error) {
        if(!error.response)
            console.log('500: There was a problem with the server, please try again later')
        else 
            console.log(error)
    }
}

