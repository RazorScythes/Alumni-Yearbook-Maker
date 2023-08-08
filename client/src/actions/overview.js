import * as api from '../api'

export const getOverviewData = () => async(dispatch) => {
    try {
        const { data } = await api.getOverviewData()

        dispatch({
            type: 'OVERVIEW_DATA',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const getStudentQuery = (keyword) => async(dispatch) => {
    try {
        const { data } = await api.getStudentQuery(keyword)

        dispatch({
            type: 'STUDENT_SEARCH_QUERY',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}


export const getNotification = () => async(dispatch) => {
    try {
        const { data } = await api.getNotification()

        dispatch({
            type: 'NOTIFICATION',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}


export const updateNotification = (arr) => async(dispatch) => {
    try {
        const { data } = await api.updateNotification(arr)

        dispatch({
            type: 'UPDATE_NOTIFICATION',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}