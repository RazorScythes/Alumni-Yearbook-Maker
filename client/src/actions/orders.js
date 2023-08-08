import * as api from '../api'

export const getOrders = () => async(dispatch) => {
    try {
        const { data } = await api.getOrders()

        dispatch({
            type: 'FETCH_ORDERS',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const setStatusReleasing = (id) => async(dispatch) => {
    try {
        const { data } = await api.setStatusReleasing(id)

        dispatch({
            type: 'STATUS_UPDATE',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const setStatusOK = (id) => async(dispatch) => {
    try {
        const { data } = await api.setStatusOK(id)

        dispatch({
            type: 'STATUS_UPDATE',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}