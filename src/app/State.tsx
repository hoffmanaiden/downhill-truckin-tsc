
export type StateType = {
    cameraView: any; // replace 'any' with the actual type of cameraView
    cameraViewUnlocked: boolean;
};

export function reducer(state: StateType, action: any) {
    switch (action.type) {
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