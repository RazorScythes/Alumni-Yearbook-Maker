export default (pdf_yearbook = [], action) => {
    switch(action.type){
        case 'FETCH_PDF_YEAR':
            return {...pdf_yearbook, academic_year: action.payload}
        case 'FETCH_PDF_FILES':
            return {...pdf_yearbook, files: action.payload}
        case 'BATCH_YEARBOOK':
                return {...pdf_yearbook, 
                    files: action.payload.entry,
                    message: action.payload.message
                }
        case 'SECTION_YEARBOOK':
 
            return {...pdf_yearbook, 
                files: action.payload.entry,
                message: action.payload.message
            }
        case 'ENABLE_DISABLE':
            return {...pdf_yearbook, files: action.payload}
        default:
            return pdf_yearbook
    }
}