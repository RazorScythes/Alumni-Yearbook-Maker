export default (batch = [], action) => {
    switch(action.type){
        case 'EDIT_BATCH_YEAR':
            return {
                ...batch,
                batch_year: action.payload.new,
                message:    action.payload.message,
                variant:    action.payload.variant,
                heading:    action.payload.heading
            }
        case 'CREATE_BATCH_YEAR':
            return {
                ...batch,
                message:  action.payload.message,
                variant:  action.payload.variant,
                heading:  action.payload.heading
            }
        case 'CREATE_TEMPLATE':
            return {
                ...batch,
                template:  action.payload.data,
                message:   action.payload.message,
                variant:   action.payload.variant,
                heading:   action.payload.heading
            }
            // return [...batch, {success: action.payload}]
        case 'CREATE_FRAME':
            return {
                ...batch,
                frame:    action.payload.data,
                message:  action.payload.message,
                variant:  action.payload.variant,
                heading:  action.payload.heading
            }
        case 'CREATE_BANNER':
            return {
                ...batch,
                banner:   action.payload.data,
                message:  action.payload.message,
                variant:  action.payload.variant,
                heading:  action.payload.heading
            }
        case 'CREATE_COVER':
            return {
                ...batch,
                cover:   action.payload.data,
                message: action.payload.message,
                variant: action.payload.variant,
                heading: action.payload.heading
            }
        case 'CREATE_NAMETAGS':
            return {
                ...batch,
                nametags: action.payload.data,
                message:  action.payload.message,
                variant:  action.payload.variant,
                heading:  action.payload.heading
            }
        case 'UPDATE_DESIGN':
            return {
                ...batch,
                category: action.payload.category,
                cover:  action.payload.cover,
                template:  action.payload.template,
                nametags:  action.payload.nametag
            }
        case 'BATCH_ERROR':
            return {...batch, 
                message: action.err.message,
                variant: action.err.variant,
                heading: action.err.heading
            }
        case 'FETCH_BATCH_YEAR':
            return {...batch, batch_year: action.payload}
        case 'FETCH_TEMPLATE':
            return {...batch, template: action.payload}
        case 'FETCH_FRAME':
            return {...batch, frame: action.payload}
        case 'FETCH_BANNER':
            return {...batch, banner: action.payload}
        case 'FETCH_COVER':
            return {...batch, cover: action.payload}
        case 'FETCH_NAMETAGS':
            return {...batch, nametags: action.payload}
        case 'FETCH_CURRENT_BATCHYEAR':
            return {...batch, year: action.payload.year}
        case 'FETCH_CATEGORY':
            return {...batch, category: action.payload}
        case 'CHECK_YEAR':
            return {...batch, validate_year: action.payload}
        default:
            return batch
    }
}