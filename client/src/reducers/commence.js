export default (commence = [], action) => {
    switch(action.type){
        case 'FETCH_COMMENCE_YEAR':
            return {...commence, academic_year: action.payload}
        case 'FETCH_COMMENCE_DATA':
            return {...commence, message_list: action.payload}
        case 'UPLOAD_MESSAGE':
            return {...commence, 
                message_list: commence.message_list.concat(action.payload.entry),
                message: action.payload.message
            }
        case 'EDIT_MESSAGE':
            return {...commence, 
                message_list: action.payload.entry,
                message: action.payload.message
            }
        case 'DELETE_MESSAGE':
            return {...commence, 
                message_list: action.payload.entry,
                message: action.payload.message
            }
        case 'FETCH_POSITION':
            return {...commence,
                position_list: action.payload
            }
        case 'UPLOAD_POSITION':
            return {...commence,
                position_list: commence.position_list.concat(action.payload.position_list),
                modal_message: action.payload.message
            }
        case 'EDIT_POSITION':
            return {...commence,
                position_list: action.payload.position_list,
                modal_message: action.payload.message
            }
        case 'DELETE_POSITION':
            return {...commence,
                message_list: action.payload.data,
                position_list: action.payload.position_list,
                modal_message: action.payload.message
            }
        case 'POSITION_NOTFOUND':
            return {...commence,
                position_list: [],
            }
        case 'SERVER_ERROR_UPLOADFAILED':
            return {...commence,
                modal_message: action.err.message,
                modal_variant: action.err.variant
            }
        default:
            return commence
    }
}