export default (accounts = [], action) => {
    switch(action.type){
        case 'FETCH_ACCOUNT_ROLE':
            return {...accounts, account_role: action.payload}
        case 'FETCH_ACCOUNTS':
            return {...accounts, account_list: action.payload}
        case 'UPLOAD_ACCOUNT':
            return {...accounts, account_list: accounts.account_list.concat(action.payload)}
        case 'UPDATE_ACCOUNT':
            return {...accounts, 
                account_list: action.payload.entry,
                message: action.payload.message
            }
        case 'DELETE_ACCOUNT':
            return {...accounts, 
                account_list: action.payload.entry,
                message: action.payload.message
            }
        case 'ACCOUNT_CONFIRMATION_ERROR':
            return {...accounts, 
                err_message: action.err.err_message,
            }
        case 'GMAIL_SENT':
            return {...accounts, 
                message: action.payload.message
            }
        default:
            return accounts
    }
}