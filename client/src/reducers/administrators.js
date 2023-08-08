export default (admin = [], action) => {
    switch(action.type){
        case 'FETCH_ADMIN_YEAR':
            return {...admin, academic_year: action.payload}
        case 'FETCH_ADMINISTRATORS':
            return {...admin,
                administration: {
                    title: action.payload.title ? action.payload.title : admin.administration.title,
                    admin: action.payload.admin
                },
            }
        case 'UPLOAD_ADMINISTRATORS':
            admin.administration.admin = admin.administration.admin.concat(action.payload)
            return {...admin}
        case 'UPDATE_ADMINISTRATORS':
            admin.administration.admin = action.payload.entry
            return {...admin, 
                message: action.payload.message,
                variant: action.payload.variant
            }
        case 'DELETE_ADMINISTRATORS':
            admin.administration.admin = action.payload.entry
            return {...admin, 
                message: action.payload.message,
                variant: action.payload.variant
            }
        case 'ADMINISTRATORS_ERROR':
            return {...admin,
                administration: {
                    title: action.err.title ? action.err.title : admin.administration ? admin.administration.title : [],
                    admin: []
                },
                message: action.err.message,
                variant: action.err.variant,
                // heading: action.err.heading
            }
        case 'UPLOAD_ERROR':
            return {...admin,
                message: action.err.message,
                variant: action.err.variant,
            }
        case 'ADD_ADMINISTRATION':
            admin.administration.title = admin.administration.title.concat(action.payload.title)
            return {...admin,
                message: action.payload.message,
                variant: action.payload.variant,
            }
        case 'EDIT_ADMINISTRATION':
            return {...admin,
                administration: {
                    title: action.payload,
                    admin: admin.administration.admin
                }
            }
        case 'DELETE_ADMINISTRATION':
            return {...admin,
                administration: {
                    title: action.payload.title,
                    admin: action.payload.admin
                },
                message: action.payload.message,
                variant: action.payload.variant
            }
        default:
            return admin
    }
}