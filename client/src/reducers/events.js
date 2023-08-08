export default (events = [], action) => {
    switch(action.type){
        case 'FETCH_EVENT_YEAR':
            return {...events, academic_year: action.payload}
        case 'FETCH_EVENT':
            return {...events, events_list: action.payload}
        case 'FETCH_NEWS':
            return {...events, news_list: action.payload}
        case 'UPLOAD_EVENT':
            return {...events, 
                events_list: events.events_list.concat(action.payload.entry),
                message: action.payload.message
            }
        case 'EDIT_EVENT':
            return {...events, 
                events_list: action.payload.entry,
                message: action.payload.message
            }
        case 'DELETE_EVENT':
            return {...events, 
                events_list: action.payload.entry,
                message: action.payload.message
            }
        case 'UPLOAD_NEWS':
            return {...events, 
                news_list: events.news_list.concat(action.payload.entry),
                message: action.payload.message
            }
        case 'EDIT_NEWS':
            return {...events, 
                news_list: action.payload.entry,
                message: action.payload.message
            }
        case 'DELETE_NEWS':
            return {...events, 
                news_list: action.payload.entry,
                message: action.payload.message
            }
        default:
            return events
    }
}