export default (orders = [], action) => {
    switch(action.type){
        case 'FETCH_ORDERS':
            return {...orders, order_list: action.payload}
        case 'STATUS_UPDATE':
            return {...orders, order_list: action.payload}
        default:
            return orders
    }
}