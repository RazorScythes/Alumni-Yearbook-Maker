export default (content = [], action) => {
    switch(action.type){
        case 'HOME_SEARCH':
            return {...content, query: action.payload}
        case 'HOME_QUERY':
            return {...content, search: action.payload}
        case 'HOME_CONTENT':
            return {...content, data: action.payload}
        case 'GRADUATES':
            return {...content, graduates: action.payload}
        case 'HOME_ALL_EVENT':
             return {...content, all_event: action.payload}
        case 'YEAR_HEADER':
            return {...content, year: action.payload}
        case 'COMMENCE_DATA':
            return {...content, commence: action.payload}
        case 'ALUMNI_PROFILE':
            return {...content, profile: action.payload}
        case 'ALUMNI_DOWNLOADS':
            return {...content, downloads: action.payload}
        case 'HOME_EVENT':
            return {...content, event: action.payload}
        case 'HOME_NEWS':
            return {...content, news: action.payload}
        case 'HOME_ORDER':
            return {...content, order: action.payload}
        case 'GALLERY_DATA':
            return {...content, gallery: action.payload}
        case 'HOME_CHANGE_PASSWORD':
            return {...content, 
                message: action.payload.message,
                variant: action.payload.variant
            }
        case 'SEARCH_ERROR':
            return {...content, 
                query: []
            }
        case 'PROFILE_ERROR':
            return {...content, 
                message: action.err
            }
        case 'GRADUATE_ERROR':
            return {...content, 
                message: action.err
            }
        default:
            return content
    }
}