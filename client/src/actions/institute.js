import * as api from '../api'

export const getInstitute = () => async(dispatch) => {
    try {
        const { data } = await api.getInstitute()

        dispatch({
            type: 'FETCH_INSTITUTE',
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
                type: 'FETCH_ERROR',
                err: {
                    message: 'No institute found',
                    variant: 'danger',
                    data: []
                }
            })
    }
}

export const uploadInstitute = (inst) => async(dispatch) => {
    try {
        const { data } = await api.uploadInstitute(inst)

        dispatch({
            type: 'UPLOAD_INSTITUTE',
            payload: {
                data: data.newEntry,
                message: data.message, 
                variant: data.variant
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const editInstitute = (inst) => async(dispatch) => {
    try {
        const { data } = await api.editInstitute(inst)

        dispatch({
            type: 'EDIT_INSTITUTE',
            payload: {
                data: data.entry,
                message: data.message, 
                variant: data.variant
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const deleteInstitute = (id) => async(dispatch) => {
    try {
        const { data } = await api.deleteInstitute(id)

        dispatch({
            type: 'DELETE_INSTITUTE',
            payload: {
                data: data.entry,
                message: data.message, 
                variant: data.variant
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const getInstituteCounts = (inst) => async(dispatch) => {
    try {
        const { data } = await api.fetchInstituteCounts(inst)

        dispatch({
            type: 'FETCH_COUNTS',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const getSectionCounts = (inst) => async(dispatch) => {
    try {
        const { data } = await api.fetchSectionCounts(inst)

        dispatch({
            type: 'FETCH_SECTION_COUNTS',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const getAlumniList = (inst) => async(dispatch) => {
    try {
        const { data } = await api.fetchAlumniList(inst)

        dispatch({
            type: 'FETCH_ALUMNI_LIST',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const getSearchQuery = (inst) => async(dispatch) => {
    try {
        const { data } = await api.fetchSearchQuery(inst)

        dispatch({
            type: 'FETCH_SEARCH_QUERY',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const getSearchAlumni = (student_number) => async(dispatch) => {
    try {
        const { data } = await api.getSearchAlumni(student_number)

        dispatch({
            type: 'SELECTED_EDIT_STUDENT',
            payload: data
        })
    } catch (error) {
        dispatch({
            type: 'SELECTED_EDIT_NOTFOUND',
            err: {
                message: "Alumni not found",
                variant: "danger"
            }
        })
    }
}

export const checkSectionExists = (inst) => async(dispatch) => {
    try {
        const { data } = await api.checkSectionExists(inst)
        dispatch({
            type: 'CHECK_SECTION_EXISTS',
            payload: data
        })
    } catch (error) {
        // console.log(error)
        // console.clear()
    }
}

export const createSection = (inst) => async(dispatch) => {
    try {
        const { data } = await api.createSection(inst)
        dispatch({
            type: 'CREATE_SECTION',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const uploadFile = (inst) => async(dispatch) => {
    try {
        const { data } = await api.uploadFile(inst)
        dispatch({
            type: 'BULK_INSERT',
            payload: {
                data: data.entry,
                message: data.message, 
                variant: data.variant,
                heading: data.heading,
                duplicate: data.duplicate
            }
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

export const uploadFileOnSection = (inst) => async(dispatch) => {
    try {
        const { data } = await api.uploadFileOnSection(inst)
        dispatch({
            type: 'BULK_INSERT_ON_SECTION',
            payload: {
                updated_list: data.updated_list,
                message: data.message, 
                variant: data.variant,
                heading: data.heading
            }
        })
    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'UPLOAD_ERROR',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    variant: 'danger',
                    heading: '500 Internal Server Error'
                }
            })
        else
            dispatch({
                type: 'UPLOAD_ERROR',
                err: error.response.data
            })
    }
}

export const deleteSection = (inst) => async(dispatch) => {
    try {
        const { data } = await api.delete_section(inst)
        dispatch({
            type: 'DELETE_SECTION',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const checkStudentExists = (inst) => async(dispatch) => {
    try {
        const { data } = await api.checkStudentExists(inst)
        dispatch({
            type: 'CHECK_STUDENT_EXISTS',
            payload: data
        })
    } catch (error) {
        // console.log(error)
    }
}

export const uploadAlumni = (inst) => async(dispatch) => {
    try {
        const { data } = await api.uploadAlumni(inst)
        dispatch({
            type: 'CREATE_ALUMNI',
            payload: {
                data: data.entry,
                message: data.message, 
                variant: data.variant,
                heading: data.heading
            }
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

export const updateAlumni = (inst) => async(dispatch) => {
    try {
        const { data } = await api.updateAlumni(inst)
        dispatch({
            type: 'UPDATE_ALUMNI',
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

export const deleteAlumni = (inst) => async(dispatch) => {
    try {
        const { data } = await api.deleteAlumni(inst)
        dispatch({
            type: 'DELETE_ALUMNI',
            payload: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const bulkImage = (inst) => async(dispatch) => {
    try {
        const { data } = await api.bulkImage(inst)
        dispatch({
            type: 'BULK_IMAGE',
            payload: {
                updated_list: data.updated_list,
                message: data.message, 
                duplication: data.duplication,
                variant: data.variant,
                heading: data.heading
            }
        })
    } catch (error) {
        if(!error.response)
            dispatch({
                type: 'UPLOAD_ERROR',
                err: {
                    message: 'Something went wrong to the server, please try again later',
                    duplication: '',
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

