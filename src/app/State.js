export function reducer(state, action){
    switch(action.type){
        case 'mouseDown':
            return {
                ...state,
                mouseDown: true
            }
        case 'mouseUp':
            return {
                ...state,
                mouseDown: false
            }
        default:
            break;
    }
    return state;
}