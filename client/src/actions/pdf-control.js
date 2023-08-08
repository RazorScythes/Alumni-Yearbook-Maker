import * as api from '../api'
export const getPDFYear = (year) => async(dispatch) => {
    try {
        const { data } = await api.getPDFYear(year)

        dispatch({
            type: 'FETCH_PDF_YEAR',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const getPDFList = (year) => async(dispatch) => {
    try {
        const { data } = await api.getPDFList(year)

        dispatch({
            type: 'FETCH_PDF_FILES',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const generateBatchYearbook = (id) => async(dispatch) => {
    try {
        const { data } = await api.generateBatchYearbook(id)

        dispatch({
            type: 'BATCH_YEARBOOK',
            payload: {
                entry: data.entry,
                message: data.message
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const generateSectionYearbook = (id) => async(dispatch) => {
    try {
        const { data } = await api.generateSectionYearbook(id)

        dispatch({
            type: 'SECTION_YEARBOOK',
            payload: {
                entry: data.entry,
                message: data.message
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const enableLink = (id) => async(dispatch) => {
    try {
        const { data } = await api.enableLink(id)

        dispatch({
            type: 'ENABLE_DISABLE',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const disableLink = (id) => async(dispatch) => {
    try {
        const { data } = await api.disableLink(id)

        dispatch({
            type: 'ENABLE_DISABLE',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const setActive = (year) => async(dispatch) => {
    try {
        const { data } = await api.setActive(year)

        dispatch({
            type: 'ENABLE_DISABLE',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const setInactive = (year) => async(dispatch) => {
    try {
        const { data } = await api.setInactive(year)

        dispatch({
            type: 'ENABLE_DISABLE',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}