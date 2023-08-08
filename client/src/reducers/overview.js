export default (overview = [], action) => {
    switch(action.type){
        case 'OVERVIEW_DATA':
            return {...overview, data: action.payload}
        case 'NOTIFICATION':
            return {...overview, notification: action.payload}
        case 'UPDATE_NOTIFICATION':
            return {...overview}
        case 'STUDENT_SEARCH_QUERY':
            return {...overview, 
                query: action.payload
            }
        default:
            return overview
    }
}