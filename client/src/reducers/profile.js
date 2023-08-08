export default (profile = [], action) => {
    switch(action.type){
        case 'CHANGE_PASSWORD':
        case 'CHANGE_NAME':
        case 'WRONG_CREDENTIALS':
            return {
                message:   action.payload.message,
                variant:   action.payload.variant,
                heading:   action.payload.heading
            }
        default:
            return profile
    }
}