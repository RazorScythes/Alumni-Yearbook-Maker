export default (institute = [], action) => {
    switch(action.type){
        case 'FETCH_INSTITUTE':
            return {...institute, 
                inst: action.payload,
            }
        case 'UPLOAD_INSTITUTE':
            return {...institute, 
                inst: institute.inst.concat(action.payload.data),
                message: action.payload.message,
                variant: action.payload.variant,
            }
        case 'EDIT_INSTITUTE':
            return {...institute, 
                inst: action.payload.data,
                message: action.payload.message,
                variant: action.payload.variant,
            }
        case 'DELETE_INSTITUTE':
            return {...institute, 
                inst: action.payload.data,
                message: action.payload.message,
                variant: action.payload.variant,
            }
        case 'FETCH_ERROR':
            return {...institute, 
                inst: action.err.data,
                message: action.err.message,
                variant: action.err.variant,
            }
        case 'FETCH_COUNTS':
            return {...institute, a_y_counts: action.payload}
        case 'FETCH_SECTION_COUNTS':
            return {...institute, section_counts: action.payload}
        case 'FETCH_ALUMNI_LIST':
            return {...institute, alumni_list: action.payload}
        case 'FETCH_ALUMNI_DATA':
            return {...institute, alumni_data: action.payload}
        case 'FETCH_SEARCH_QUERY': 
            return {...institute, query: action.payload}
        case 'CHECK_SECTION_EXISTS':
            return {...institute, validate_section: action.payload}
        case 'CHECK_STUDENT_EXISTS':
            return {...institute, validate_student: action.payload}
        case 'CREATE_SECTION':
            institute.section_counts.section = institute.section_counts.section.concat(action.payload)
            return { ...institute }
        case 'DELETE_SECTION':
            institute.section_counts.section = action.payload
            return { ...institute }
        case 'DELETE_ALUMNI':
            institute.alumni_list.alumni = action.payload.entry
            return { ...institute,
                message: action.payload.message,
                variant: action.payload.variant,
             }
        case 'BULK_INSERT':
            institute.section_counts.section = institute.section_counts.section.concat(action.payload.data)
            return {...institute, 
                message: action.payload.message,
                variant: action.payload.variant,
                heading: action.payload.heading,
                duplicate: action.payload.duplicate
            }
        case 'BULK_INSERT_ON_SECTION':
            institute.alumni_list.alumni = action.payload.updated_list ? action.payload.updated_list : institute.alumni_list.alumni
            return {...institute, 
                message: action.payload.message,
                variant: action.payload.variant,
                heading: action.payload.heading
            }
        case 'BULK_IMAGE':
            institute.alumni_list.alumni = action.payload.updated_list
            return {...institute, 
                message: action.payload.message,
                duplication: action.payload.duplication,
                variant: action.payload.variant,
                heading: action.payload.heading
            }
        case 'CREATE_ALUMNI':
            institute.alumni_list.alumni = institute.alumni_list.alumni.concat(action.payload.data)
            return {
                ...institute, 
                message: action.payload.message,
                variant: action.payload.variant,
                heading: action.payload.heading
            }
        case 'UPDATE_ALUMNI':
            if(institute.alumni_list) institute.alumni_list.alumni = action.payload.updated
            if(institute.query) institute.query = action.payload.updated

            return {
                ...institute, 
                message: action.payload.message,
                variant: action.payload.variant,
                heading: action.payload.heading
            }
        case 'UPLOAD_ERROR':
            return {...institute, 
                message: action.err.message,
                variant: action.err.variant,
                heading: action.err.heading
            }
        case 'SELECTED_EDIT_STUDENT':
            return {...institute, 
                selected_edit: action.payload
            }
        case 'SELECTED_EDIT_NOTFOUND':
            return {...institute, 
                edit_message: action.err.message,
                edit_variant: action.err.variant
            }
        default:
            return institute
    }
}