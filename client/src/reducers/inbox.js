export default (inbox = [], action) => {
    switch(action.type){
        case 'FETCH_MESSAGE':
            return {...inbox, 
                message_list: action.payload.data,
                response: action.payload.response
            }
        case 'REPLY_MESSAGE':
            return {...inbox, 
                message_list: action.payload.data,
                message: action.payload.message
            }
        case 'REMOVE_MESSAGE':
            return {...inbox, 
                message_list: action.payload
            }
        case 'INBOX_ERROR':
            return {...inbox,
                message: action.err.message,
                variant: action.err.variant,
                // heading: action.err.heading
            }
        default:
            return inbox
    }
}