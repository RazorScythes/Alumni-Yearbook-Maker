export default (gallery = [], action) => {
    switch(action.type){
        case 'GALLERY_YEAR':
            return {...gallery, year: action.payload}
        case 'GALLERY':
            return {...gallery, images: action.payload}
        case 'GALLERY_UPLOAD':
            return {...gallery, images: gallery.images ? gallery.images.concat(action.payload) : action.payload}
        case 'EMPTY_GALLERY':
            return {...gallery, images: undefined}
        case 'DELETE_IMAGE':
            return {...gallery, images: action.payload.length > 0 ? action.payload : undefined}
        case 'GALLERY_ERROR':
            return {...gallery,
                images: undefined,
                message: action.err.message,
                variant: action.err.variant,
                heading: action.err.heading
            }
        default:
            return gallery
    }
}