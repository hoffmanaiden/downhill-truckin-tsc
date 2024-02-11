
import React, { useRef, useEffect, RefObject, createRef, useMemo, forwardRef, useState, createContext, useReducer, useContext } from 'react'


export type StateType = {
    cameraView: any; // replace 'any' with the actual type of cameraView
    cameraViewUnlocked: boolean;
    elapsedTime: number;
};

export const AppContext = createContext<{ state: any; dispatch: any } | null>(null);

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
        case 'updateTime':
            return {
                ...state,
                elapsedTime: action.value
            }
        default:
            break;
    }
    return state;
}