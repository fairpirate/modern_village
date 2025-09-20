import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';

type State = {
    user: null | { id: string; name: string };
    theme: 'light' | 'dark';
};

type Action =
    | { type: 'SET_USER'; payload: State['user'] }
    | { type: 'SET_THEME'; payload: State['theme'] };

const initialState: State = {
    user: null,
    theme: 'light',
};

function appReducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'SET_THEME':
            return { ...state, theme: action.payload };
        default:
            return state;
    }
}

const AppContext = createContext<{
    state: State;
    dispatch: Dispatch<Action>;
}>({
    state: initialState,
    dispatch: () => undefined,
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);