export default (state = { authData : null }, action) => {
    switch(action.type){
        case 'AUTH':
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
            return { ...state, authData: action.data, loading: false, errors: null };
        case 'AUTH_ERROR':
            console.log(action.err)
            return {error: action.err};
        case 'RESET_VERIFICATION_SENT':
            return {
                ...state,
                email: action.data.message,
                not_exists: ''
            };
        case 'CHECK_RESET_CONFIRMATION':
            return {
                ...state,
                reset_state: action.data.message,
            };
        case 'NEW_PASSWORD':
            return {
                ...state,
                new_password: action.data.message,
            };
        case 'EMAIL_NOT_FOUND':
            return {
                ...state,
                not_exists: action.err
            };
        case 'LOGOUT':
            localStorage.removeItem('profile')
            return {...state, authData: null}
        default:
            return state
    }
}