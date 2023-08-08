export default (ha = [], action) => {
    switch(action.type){
        case 'FETCH_HA_YEAR':
            return {...ha, ha_year: action.payload}
        case 'FETCH_HA':
            console.log(action.payload)
            return {...ha, 
                title: action.payload.title,
                ha_list: action.payload.ha
            }
        case 'UPLOAD_HONOR_TITLE':
            return {...ha, 
                title: ha.title.concat(action.payload.newTitle),
                message: action.payload.message
            }
        case 'EDIT_HONOR_TITLE':
            return {...ha, 
                title: action.payload.updatedTitle,
                ha_list: action.payload.ha,
                message: action.payload.message
            }
        case 'DELETE_HONOR_TITLE':
            console.log(action.payload)
            return {...ha, 
                title: action.payload.title,
                ha_list: action.payload.ha,
                message: action.payload.message
            }
        case 'UPLOAD_HA':
            return {...ha, ha_list: ha.ha_list.concat(action.payload)}
        case 'UPDATE_HA':
            return {...ha, 
                ha_list: action.payload.ha,
                message: action.payload.message
            }
        case 'DELETE_HA':
            return {...ha, 
                ha_list: action.payload.entry,
                message: action.payload.message
            }
        case 'HA_NOTFOUND':
            return {...ha,
                title: [],
                ha_list: action.err.ha ? action.err.ha : [],
                message: action.err.message ? action.err.message : null,
                variant: action.err.variant ? action.err.variant : null
            }
        default:
            return ha
    }
}