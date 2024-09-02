// src/redux/actions.js

// Action Types
export const SET_USER = 'SET_USER';
export const SET_USER_NULL = 'SET_USER_NULL';


// Action Creators
export const setUser = (user) => ({
    type: SET_USER,
    user: user,
});

export const setUserNull = () => ({
    type: SET_USER_NULL,
});


