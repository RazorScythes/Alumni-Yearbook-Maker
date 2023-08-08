import * as api from '../api'
export const getEventYear = (year) => async(dispatch) => {
    try {
        const { data } = await api.getEventYear(year)

        dispatch({
            type: 'FETCH_EVENT_YEAR',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const getEvents = () => async(dispatch) => {
    try {
        const { data } = await api.getEvents()

        dispatch({
            type: 'FETCH_EVENT',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const uploadEvents = (form) => async(dispatch) => {
    try {
        const { data } = await api.uploadEvents(form)

        dispatch({
            type: 'UPLOAD_EVENT',
            payload: {
                entry: data.entry,
                message: data.message
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const editEvents = (form) => async(dispatch) => {
    try {
        const { data } = await api.editEvents(form)

        dispatch({
            type: 'EDIT_EVENT',
            payload: {
                entry: data.entry,
                message: data.message
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const deleteEvents = (id) => async(dispatch) => {
    try {
        const { data } = await api.deleteEvents(id)

        dispatch({
            type: 'DELETE_EVENT',
            payload: {
                entry: data.entry,
                message: data.message
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const getNews = () => async(dispatch) => {
    try {
        const { data } = await api.getNews()

        dispatch({
            type: 'FETCH_NEWS',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const uploadNews = (form) => async(dispatch) => {
    try {
        const { data } = await api.uploadNews(form)

        dispatch({
            type: 'UPLOAD_NEWS',
            payload: {
                entry: data.entry,
                message: data.message
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const editNews = (form) => async(dispatch) => {
    try {
        const { data } = await api.editNews(form)

        dispatch({
            type: 'EDIT_NEWS',
            payload: {
                entry: data.entry,
                message: data.message
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const deleteNews = (id) => async(dispatch) => {
    try {
        const { data } = await api.deleteNews(id)

        dispatch({
            type: 'DELETE_NEWS',
            payload: {
                entry: data.entry,
                message: data.message
            }
        })
    } catch (error) {
        console.log(error)
    }
}
