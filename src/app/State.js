export function reducer(state, action){
    switch(action.type){
        case 'changeView':
            return {
                ...state,
                cameraView: action.value,
                cameraViewUnlocked: false
            }
        case 'unlockView':
            return {
                ...state,
                cameraViewUnlocked: true
            }
        default:
            break;
    }
    return state;
}